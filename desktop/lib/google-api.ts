import { getTokens, saveTokens, initiateGoogleLogin } from './google-auth';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"; // Must match google-auth.ts

async function getValidAccessToken(): Promise<string> {
  let tokens = await getTokens();
  
  if (!tokens) {
    throw new Error("User not authenticated with Google");
  }

  // Check if token is expired or about to expire (within 5 minutes)
  if (Date.now() > tokens.expires_at - 5 * 60 * 1000) {
    if (!tokens.refresh_token) {
      throw new Error("Access token expired and no refresh token available. Please re-authenticate.");
    }
    
    // Refresh the token
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        refresh_token: tokens.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token", await response.text());
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    tokens = {
      ...tokens,
      access_token: data.access_token,
      expires_in: data.expires_in,
      expires_at: Date.now() + (data.expires_in * 1000),
      scope: data.scope || tokens.scope,
    };
    
    await saveTokens(tokens);
  }

  return tokens.access_token;
}

export async function exportToGoogleDocs(title: string, content: string): Promise<string> {
  const accessToken = await getValidAccessToken();

  // 1. Create an empty document
  const createRes = await fetch("https://docs.googleapis.com/v1/documents", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Google Doc: ${await createRes.text()}`);
  }

  const document = await createRes.json();
  const documentId = document.documentId;

  // 2. Insert content into the document
  const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: {
              index: 1, // Start of document
            },
            text: content,
          },
        },
      ],
    }),
  });

  if (!updateRes.ok) {
    throw new Error(`Failed to update Google Doc content: ${await updateRes.text()}`);
  }

  // Return the URL to open the document
  return `https://docs.google.com/document/d/${documentId}/edit`;
}
