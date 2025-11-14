import fs from "fs";
import path from "path";
import { google } from "googleapis";

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

async function deleteOldFiles(folderId) {
  const auth = await authorize();
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, createdTime)",
  });

  const files = res.data.files;
  if (!files || files.length === 0) {
    console.log("No hay archivos para revisar.");
    return;
  }

  const now = new Date();

  for (const file of files) {
    const createdDate = new Date(file.createdTime);
    const diffYears = (now - createdDate) / (1000 * 60 * 60 * 24 * 365); // años

    if (diffYears >= 1) {
      try {
        await drive.files.delete({ fileId: file.id });
        console.log(`🗑️ Archivo eliminado: ${file.name} (creado el ${createdDate.toISOString()})`);
      } catch (err) {
        console.error(`Error al eliminar ${file.name}:`, err.message);
      }
    } else {
      console.log(`✅ Archivo reciente: ${file.name} (creado el ${createdDate.toISOString()})`);
    }
  }
}

// 👉 Reemplaza con el ID de la carpeta de la cédula (subcarpeta)
const folderId = "1UGAaWj_2uvs3Q9YkZCivfJKzOdqmk4oM";

deleteOldFiles(folderId).catch(console.error);
