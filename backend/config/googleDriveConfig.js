// backend/config/googleDriveConfig.js
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas (siempre correctas porque están al lado de este archivo)
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

export async function authenticate() {
  // =========================
  // 1) Credenciales (env primero)
  // =========================
  let clientId = process.env.GOOGLE_CLIENT_ID;
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  let redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      throw new Error(
        "No encontré credentials.json y tampoco variables GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI."
      );
    }
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
    const web = credentials.web || credentials.installed;

    clientId = clientId || web.client_id;
    clientSecret = clientSecret || web.client_secret;
    redirectUri = redirectUri || (web.redirect_uris && web.redirect_uris[0]);
  }

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  // =========================
  // 2) Tokens (prod NO lee archivo)
  // =========================
  const isProd = process.env.NODE_ENV === "production";
  let tokens = null;

  // Local: lee token.json solo si existe
  if (!isProd && fs.existsSync(TOKEN_PATH)) {
    tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    console.log("✅ Usando token.json local");
  }

  // Producción (Render): usa refresh token de env
  if (!tokens && process.env.GOOGLE_REFRESH_TOKEN) {
    tokens = { refresh_token: process.env.GOOGLE_REFRESH_TOKEN };
    console.log("✅ Usando GOOGLE_REFRESH_TOKEN de Render");
  }

  if (!tokens) {
    throw new Error(
      "No hay tokens configurados. Genera token.json en local o define GOOGLE_REFRESH_TOKEN en Render."
    );
  }

  oAuth2Client.setCredentials(tokens);

  // Guarda tokens refrescados SOLO en local
  if (!isProd && fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.on("tokens", (newTokens) => {
      const merged = { ...tokens, ...newTokens };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
      tokens = merged;
    });
  }

  return oAuth2Client;
}
