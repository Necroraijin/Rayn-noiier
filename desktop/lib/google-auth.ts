import { LazyStore } from '@tauri-apps/plugin-store';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';

const authStore = new LazyStore('google-tokens.json');

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"; // Replace with your actual client ID
const REDIRECT_URI = "rayn://auth"; 
const SCOPES = "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file";

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
  expires_at: number; // Unix timestamp
}

// PKCE Helper Functions
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function initiateGoogleLogin(): Promise<void> {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Temporarily store the verifier to check against the callback
  sessionStorage.setItem('code_verifier', codeVerifier);

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPES);
  authUrl.searchParams.append("code_challenge", codeChallenge);
  authUrl.searchParams.append("code_challenge_method", "S256");
  authUrl.searchParams.append("access_type", "offline"); // Needed for refresh token
  authUrl.searchParams.append("prompt", "consent");

  // Open the system browser
  window.open(authUrl.toString(), '_blank');
}

export async function handleGoogleCallback(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get("code");
    if (!code) {
      console.error("No authorization code found in URL");
      return;
    }

    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (!codeVerifier) {
      console.error("No code verifier found in session");
      return;
    }

    const tokenUrl = "https://oauth2.googleapis.com/token";
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        code: code,
        code_verifier: codeVerifier,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to exchange token", errorText);
      throw new Error("Token exchange failed");
    }

    const data = await response.json();
    
    const tokens: GoogleTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token, // Might not be returned if not first authorization
      expires_in: data.expires_in,
      token_type: data.token_type,
      scope: data.scope,
      expires_at: Date.now() + (data.expires_in * 1000),
    };

    await saveTokens(tokens);
    sessionStorage.removeItem('code_verifier');
    
    // Dispatch a custom event to notify the UI
    window.dispatchEvent(new CustomEvent('google-auth-success'));
  } catch (err) {
    console.error("Error handling Google callback:", err);
  }
}

// Setup the listener for deep links
export async function setupDeepLinkListener() {
  if (typeof window !== 'undefined') {
    try {
      await onOpenUrl((urls) => {
        for (const url of urls) {
          if (url.startsWith(REDIRECT_URI)) {
            handleGoogleCallback(url);
          }
        }
      });
    } catch (e) {
      console.error("Failed to setup deep link listener:", e);
    }
  }
}

export async function saveTokens(tokens: GoogleTokens) {
  // If we receive a new access token but no refresh token, keep the old refresh token
  const existingTokens = await getTokens();
  if (existingTokens && !tokens.refresh_token) {
    tokens.refresh_token = existingTokens.refresh_token;
  }
  await authStore.set('google_tokens', tokens);
  await authStore.save();
}

export async function getTokens(): Promise<GoogleTokens | null> {
  try {
    const tokens = await authStore.get<GoogleTokens>('google_tokens');
    return tokens || null;
  } catch (error) {
    console.error("Failed to get google tokens from secure store", error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const tokens = await getTokens();
  // Basic check, does not validate expiry here
  return !!tokens && !!tokens.access_token;
}
