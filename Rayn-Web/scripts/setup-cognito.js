const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ─── 1. Check & Install AWS Cognito SDK ──────────────────────────────
try {
  require.resolve("@aws-sdk/client-cognito-identity-provider");
} catch (e) {
  console.log("Installing AWS Cognito Identity Provider SDK...");
  execSync("npm install @aws-sdk/client-cognito-identity-provider", { stdio: "inherit" });
}

const {
  CognitoIdentityProviderClient,
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  CreateUserPoolDomainCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand
} = require("@aws-sdk/client-cognito-identity-provider");

// ─── 2. Parse .env file manually ──────────────────────────────────────
const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  console.error("Error: .env file not found in project root. Please create it first.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const accessKeyId = env.AWS_ACCESS_KEY_ID;
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;
const region = env.AWS_REGION || "us-east-1";

if (!accessKeyId || !secretAccessKey) {
  console.error("Error: AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is empty in .env.");
  console.error("Please add your credentials to the .env file first, then run this script.");
  process.exit(1);
}

// ─── 3. Initialize Cognito Client ─────────────────────────────────────
const client = new CognitoIdentityProviderClient({
  region,
  credentials: { accessKeyId, secretAccessKey }
});

async function run() {
  try {
    console.log("Creating Cognito User Pool...");
    
    // Create User Pool with custom attributes and relaxed password policy
    const createUserPool = new CreateUserPoolCommand({
      PoolName: "RaynUserPool",
      UsernameAttributes: ["email"],
      AutoVerifiedAttributes: ["email"],
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireLowercase: false,
          RequireNumbers: false,
          RequireSymbols: false,
          RequireUppercase: false,
          TemporaryPasswordValidityDays: 365
        }
      },
      Schema: [
        {
          Name: "role",
          AttributeDataType: "String",
          Mutable: true,
          Required: false
        },
        {
          Name: "tenantId",
          AttributeDataType: "String",
          Mutable: true,
          Required: false
        }
      ]
    });

    const poolResponse = await client.send(createUserPool);
    const userPoolId = poolResponse.UserPool.Id;
    console.log(`Successfully created Cognito User Pool: ${userPoolId}`);

    console.log("Creating App Client...");
    const createClient = new CreateUserPoolClientCommand({
      ClientName: "RaynNextAuthClient",
      UserPoolId: userPoolId,
      GenerateSecret: true,
      ExplicitAuthFlows: ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
      SupportedIdentityProviders: ["COGNITO"],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthFlows: ["code"],
      AllowedOAuthScopes: ["openid", "email", "profile", "aws.cognito.signin.user.admin"],
      CallbackURLs: [
        "http://localhost:3000/api/auth/callback/cognito"
      ]
    });

    const clientResponse = await client.send(createClient);
    const clientId = clientResponse.UserPoolClient.ClientId;
    const clientSecret = clientResponse.UserPoolClient.ClientSecret;
    console.log(`Successfully created User Pool Client: ${clientId}`);

    console.log("Creating User Pool Domain...");
    const domainPrefix = `rayn-auth-${userPoolId.toLowerCase().replace(/_/g, "-")}`;
    try {
      const createDomain = new CreateUserPoolDomainCommand({
        Domain: domainPrefix,
        UserPoolId: userPoolId
      });
      await client.send(createDomain);
      console.log(`Successfully created User Pool Domain Prefix: ${domainPrefix}`);
    } catch (domainError) {
      console.warn(`Could not create User Pool Domain prefix ${domainPrefix}:`, domainError.message);
    }

    // ─── 4. Pre-create testing accounts ───────────────────────────────────
    const testUsers = [
      { email: "sumit@rayn.com", role: "SUPER_ADMIN", name: "Sumit" },
      { email: "Ayushi@rayn.com", role: "SUPER_ADMIN", name: "Ayushi" },
      { email: "judges@rayn.com", role: "SUPER_ADMIN", name: "Judge" }
    ];

    for (const user of testUsers) {
      console.log(`Provisioning Cognito login: ${user.email}...`);
      try {
        const adminCreateUser = new AdminCreateUserCommand({
          UserPoolId: userPoolId,
          Username: user.email,
          UserAttributes: [
            { Name: "email", Value: user.email },
            { Name: "email_verified", Value: "true" },
            { Name: "name", Value: user.name },
            { Name: "custom:role", Value: user.role },
            { Name: "custom:tenantId", Value: "rayn" }
          ],
          MessageAction: "SUPPRESS" // Don't send Cognito welcome emails
        });

        await client.send(adminCreateUser);

        // Set permanent password as "password"
        const adminSetPassword = new AdminSetUserPasswordCommand({
          UserPoolId: userPoolId,
          Username: user.email,
          Password: "password",
          Permanent: true
        });

        await client.send(adminSetPassword);
        console.log(`Successfully created user: ${user.email}`);
      } catch (userError) {
        console.warn(`Failed to create test user ${user.email}:`, userError.message);
      }
    }

    // ─── 5. Write back to .env ─────────────────────────────────────────
    const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    let updatedEnvContent = envContent;
    
    // Helper to replace or append env vars
    const setEnvVar = (key, val) => {
      const regex = new RegExp(`^${key}\\s*=.*$`, "m");
      if (regex.test(updatedEnvContent)) {
        updatedEnvContent = updatedEnvContent.replace(regex, `${key}="${val}"`);
      } else {
        updatedEnvContent += `\n${key}="${val}"`;
      }
    };

    setEnvVar("COGNITO_CLIENT_ID", clientId);
    setEnvVar("COGNITO_CLIENT_SECRET", clientSecret);
    setEnvVar("COGNITO_ISSUER", cognitoIssuer);

    fs.writeFileSync(envPath, updatedEnvContent, "utf-8");
    console.log("Successfully updated .env with COGNITO credentials!");
    console.log("\nSetup Complete 🎉");

  } catch (error) {
    console.error("Cognito setup failed:", error);
  }
}

run();
