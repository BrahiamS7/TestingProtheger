// generate_token.js
import express from "express";
import open from "open";
import fs from "fs";
import { google } from "googleapis";

const CREDENTIALS_PATH = "./config/credentials.json";
const TOKEN_PATH = "./token.json";
const PORT = 4000;
const REDIRECT_PATH = "/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/drive"]; // acceso completo a Drive

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error("No encontré credentials.json en la carpeta. Descárgalo desde Google Cloud.");
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Si ya existe token.json, muestra mensaje y sal.
if (fs.existsSync(TOKEN_PATH)) {
  console.log("token.json ya existe. Si quieres regenerarlo, elimina token.json y ejecuta de nuevo.");
  process.exit(0);
}

const app = express();

app.get(REDIRECT_PATH, async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No se recibió el code en la URL.");
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    res.send("Autorización exitosa! Puedes cerrar esta ventana. token.json guardado en el servidor.");
    console.log("✅ token.json creado correctamente.");
    console.log("Tokens:", tokens);
    // corta el servidor un segundo después
    setTimeout(() => process.exit(0), 1000);
  } catch (err) {
    console.error("Error intercambiando el code por token:", err);
    res.status(500).send("Error al obtener token. Revisa la consola del servidor.");
  }
});

app.listen(PORT, async () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", // solicita refresh_token
    scope: SCOPES,
    prompt: "consent", // fuerza a dar refresh_token la primera vez
  });

  console.log(`Abriendo URL de autorización (si el navegador no se abre, copia la URL):\n\n${authUrl}\n`);
  // intenta abrir el navegador automáticamente (opcional)
  try {
    await open(authUrl);
  } catch {
    console.log("No se pudo abrir el navegador automáticamente. Copia y pega la URL en tu navegador.");
  }
});
