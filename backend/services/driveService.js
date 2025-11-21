// backend/config/googleDriveConfig.js
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const CREDENTIALS_PATH = path.resolve("backend/config/credentials.json");
const TOKEN_PATH = path.resolve("backend/config/token.json");

export async function authenticate() {
  // =========================
  // 1) Cargar credenciales
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
  // 2) Cargar tokens
  // =========================
  let tokens = null;

  // Local: token.json existe
  if (fs.existsSync(TOKEN_PATH)) {
    tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  }

  // Producción (Render): usar refresh token desde env
  if (!tokens && process.env.GOOGLE_REFRESH_TOKEN) {
    tokens = { refresh_token: process.env.GOOGLE_REFRESH_TOKEN };
  }

  if (!tokens) {
    throw new Error(
      "No hay tokens configurados. Genera token.json en local o define GOOGLE_REFRESH_TOKEN en Render."
    );
  }

  oAuth2Client.setCredentials(tokens);

  // =========================
  // 3) (Opcional) Guardar tokens refrescados en local
  // =========================
  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.on("tokens", (newTokens) => {
      const merged = { ...tokens, ...newTokens };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
      tokens = merged;
    });
  }

  return oAuth2Client;
}
// ... todo tu código arriba

export {
  createFolder,
  uploadFile,
  listFiles,
  deleteFile,
  cleanupOldFiles,
  updateFile,
  deleteFolder,
};
