const {
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommand,
  UpdateUserPoolClientCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const fs = require("fs");
const path = require("path");

// Parse .env file manually
const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  console.error("Error: .env file not found.");
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
const clientId = env.COGNITO_CLIENT_ID;
const issuer = env.COGNITO_ISSUER;
const userPoolId = issuer ? issuer.split("/").pop() : undefined;

if (!accessKeyId || !secretAccessKey || !clientId || !userPoolId) {
  console.error("Error: Missing credentials or configuration in .env");
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({
  region,
  credentials: { accessKeyId, secretAccessKey }
});

async function run() {
  try {
    console.log(`Describing App Client ${clientId} in User Pool ${userPoolId}...`);
    const describeCommand = new DescribeUserPoolClientCommand({
      ClientId: clientId,
      UserPoolId: userPoolId
    });
    
    const describeRes = await client.send(describeCommand);
    const clientDetails = describeRes.UserPoolClient;
    
    console.log("Current ExplicitAuthFlows:", clientDetails.ExplicitAuthFlows);
    
    // Add ALLOW_USER_PASSWORD_AUTH and ALLOW_REFRESH_TOKEN_AUTH
    const flows = new Set(clientDetails.ExplicitAuthFlows || []);
    flows.add("ALLOW_USER_PASSWORD_AUTH");
    flows.add("ALLOW_REFRESH_TOKEN_AUTH");
    const updatedFlows = Array.from(flows);
    
    console.log("Updating ExplicitAuthFlows to:", updatedFlows);
    
    const updateCommand = new UpdateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientId: clientId,
      ClientName: clientDetails.ClientName,
      ExplicitAuthFlows: updatedFlows,
      SupportedIdentityProviders: clientDetails.SupportedIdentityProviders,
      CallbackURLs: clientDetails.CallbackURLs,
      LogoutURLs: clientDetails.LogoutURLs,
      DefaultRedirectURI: clientDetails.DefaultRedirectURI,
      AllowedOAuthFlows: clientDetails.AllowedOAuthFlows,
      AllowedOAuthScopes: clientDetails.AllowedOAuthScopes,
      AllowedOAuthFlowsUserPoolClient: clientDetails.AllowedOAuthFlowsUserPoolClient,
      AnalyticsConfiguration: clientDetails.AnalyticsConfiguration,
      TokenValidityUnits: clientDetails.TokenValidityUnits,
      ReadAttributes: clientDetails.ReadAttributes,
      WriteAttributes: clientDetails.WriteAttributes,
      AccessTokenValidity: clientDetails.AccessTokenValidity,
      IdTokenValidity: clientDetails.IdTokenValidity,
      RefreshTokenValidity: clientDetails.RefreshTokenValidity,
      EnableTokenRevocation: clientDetails.EnableTokenRevocation,
      PreventUserExistenceErrors: clientDetails.PreventUserExistenceErrors
    });
    
    await client.send(updateCommand);
    console.log("Successfully enabled USER_PASSWORD_AUTH flow on AWS Cognito App Client! 🎉");
  } catch (error) {
    console.error("Failed to update client authentication flows:", error);
  }
}

run();
