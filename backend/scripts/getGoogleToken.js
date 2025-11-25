// backend/scripts/getGoogleToken.js
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usa el mismo credentials.json que ya usa googleDriveConfig.js
const CREDENTIALS_PATH = path.join(__dirname, "..", "config", "credentials.json");
const TOKEN_PATH = path.join(__dirname, "..", "config", "token.json");

async function main() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const web = credentials.web || credentials.installed;

  const clientId = web.client_id;
  const clientSecret = web.client_secret;
  const redirectUri = web.redirect_uris[0];

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // fuerza que Google devuelva refresh_token
  });

  console.log("1) Abre esta URL en tu navegador:");
  console.log(authUrl);
  console.log("\n2) INICIA SESIÓN CON LA NUEVA CUENTA DE GOOGLE (la del nuevo Drive).");
  console.log("3) Cuando Google te redirija a http://localhost:4000/oauth2callback (aunque salga error), copia el parámetro 'code=' de la URL.");
  console.log("4) Pega ese 'code' aquí.\n");

  process.stdout.write("Code: ");
  process.stdin.on("data", async (data) => {
    const code = data.toString().trim();
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      console.log("\n✅ Tokens obtenidos:");
      console.log(tokens);

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log(`\n💾 Guardado en: ${TOKEN_PATH}`);
      console.log("👉 IMPORTANTE: copia el 'refresh_token' para usarlo en Render (GOOGLE_REFRESH_TOKEN).");

      process.exit(0);
    } catch (err) {
      console.error("❌ Error obteniendo tokens:", err);
      process.exit(1);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
