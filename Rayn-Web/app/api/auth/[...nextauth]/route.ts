import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

const handler = NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || "MOCK_CLIENT_ID",
      clientSecret: process.env.COGNITO_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
      issuer: process.env.COGNITO_ISSUER || "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_RaynProd",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Map roles and tenant groups from AWS Cognito claims
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
})

export { handler as GET, handler as POST }
