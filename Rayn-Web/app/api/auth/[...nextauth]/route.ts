import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider"
import crypto from "crypto"

// Initialize the Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

// Calculate the Cognito SECRET_HASH required for client-secret validation
function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64")
}

// Decode the Cognito IdToken JWT to extract user attributes and claims
function decodeJWT(token: string): any {
  const parts = token.split(".")
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token format")
  }
  const payloadJson = Buffer.from(parts[1], "base64").toString("utf8")
  return JSON.parse(payloadJson)
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Cognito Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        const clientId = process.env.COGNITO_CLIENT_ID
        const clientSecret = process.env.COGNITO_CLIENT_SECRET

        if (!clientId) {
          throw new Error("AWS Cognito Client ID is not configured")
        }

        try {
          const authParams: Record<string, string> = {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
          }

          if (clientSecret) {
            authParams.SECRET_HASH = calculateSecretHash(
              credentials.username,
              clientId,
              clientSecret
            )
          }

          const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: clientId,
            AuthParameters: authParams,
          })

          const response = await cognitoClient.send(command)

          if (response.ChallengeName) {
            throw new Error(`Authentication challenge required: ${response.ChallengeName}`)
          }

          const authResult = response.AuthenticationResult
          if (!authResult || !authResult.IdToken) {
            throw new Error("No authentication tokens returned by Cognito")
          }

          // Parse claims from the IdToken to retrieve the user's role and tenantId
          const claims = decodeJWT(authResult.IdToken)

          return {
            id: claims.sub || claims.email,
            email: claims.email,
            name: claims.name || claims.email.split("@")[0],
            role: claims["custom:role"] || "ASSOCIATE",
            tenantId: claims["custom:tenantId"] || "rayn",
          }
        } catch (error: any) {
          console.error("Cognito login authentication error:", error)
          throw new Error(error.message || "Invalid credentials")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "ASSOCIATE"
        token.tenantId = (user as any).tenantId || "rayn"
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
