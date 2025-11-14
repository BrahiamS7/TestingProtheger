import fs from "fs";
import path from "path";
import { google } from "googleapis";

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");

async function authorize() {
  const credentials = JSON.parse(await fs.promises.readFile(CREDENTIALS_PATH, "utf8"));
  const token = JSON.parse(await fs.promises.readFile(TOKEN_PATH, "utf8"));

  // ✅ detecta si la propiedad es "installed" o "web"
  const { client_id, client_secret, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

async function listFiles(auth) {
  const drive = google.drive({ version: "v3", auth });
  const res = await drive.files.list({
    pageSize: 10,
    fields: "files(id, name)",
  });

  console.log("📂 Archivos encontrados:");
  if (!res.data.files.length) {
    console.log("No se encontraron archivos en tu Drive.");
  } else {
    res.data.files.forEach((file) => console.log(`${file.name} (${file.id})`));
  }
}

authorize()
  .then(listFiles)
  .catch((err) => console.error("❌ Error:", err.message));
