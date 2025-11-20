import { google } from "googleapis";
import fs from "fs";
import { authenticate } from "../config/googleDriveConfig.js";

// ✅ Crear carpeta
export const createFolder = async (name, parentId) => {
  try {
    const auth = await authenticate();
    const drive = google.drive({ version: "v3", auth });

    // 🔎 Buscar si ya existe la carpeta
    const query = `mimeType='application/vnd.google-apps.folder' and name='${name}' and '${parentId}' in parents and trashed=false`;
    const existing = await drive.files.list({
      q: query,
      fields: "files(id, name)",
    });

    if (existing.data.files.length > 0) {
      return {
        folderId: existing.data.files[0].id,
        name: existing.data.files[0].name,
        message: "⚠️ Carpeta ya existente",
      };
    }

    // 🆕 Crear nueva carpeta
    const fileMetadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    };

    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: "id, name",
    });

    return {
      folderId: folder.data.id,
      name: folder.data.name,
      message: "✅ Carpeta creada exitosamente",
    };
  } catch (err) {
    console.error("❌ Error al crear carpeta:", err.message);
    throw err;
  }
};

// ✅ Subir archivo
export const uploadFile = async (folderId, filePath, fileName) => {
  try {
    const auth = await authenticate();
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, name, webViewLink, webContentLink",
    });

    return response.data;
  } catch (err) {
    console.error("❌ Error al subir archivo:", err.message);
    throw err;
  }
};

// ✅ Listar archivos
export const listFiles = async (folderId) => {
  try {
    const auth = await authenticate();
    const drive = google.drive({ version: "v3", auth });

    await cleanupOldFiles(folderId);

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields:
        "files(id, name, mimeType, webViewLink, webContentLink, createdTime)",
    });

    return response.data.files;
  } catch (err) {
    console.error("❌ Error al listar archivos:", err.message);
    throw err;
  }
};

// ✅ Eliminar archivo
export const deleteFile = async (fileId) => {
  try {
    const auth = await authenticate();
    const drive = google.drive({ version: "v3", auth });
    await drive.files.delete({ fileId });
    console.log(`🗑️ Archivo eliminado: ${fileId}`);
  } catch (err) {
    console.error("❌ Error al eliminar archivo:", err.message);
    throw err;
  }
};

// 🧹 Eliminar archivos con más de 1 año de antigüedad
export const cleanupOldFiles = async (folderId) => {
  try {
    const auth = await authenticate();
    const drive = google.drive({ version: "v3", auth });

    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, createdTime)",
    });

    const now = new Date();

    // 🔎 Buscar archivos con más de 365 días de antigüedad
    const oldFiles = res.data.files.filter((file) => {
      const created = new Date(file.createdTime);
      const diffDays = (now - created) / (1000 * 60 * 60 * 24);
      return diffDays > 365; // 1 año
    });

    // 🗑️ Borrar los antiguos
    for (const file of oldFiles) {
      await drive.files.delete({ fileId: file.id });
      console.log(`🗑️ Archivo eliminado por antigüedad: ${file.name}`);
    }

    return oldFiles.length;
  } catch (err) {
    console.error("❌ Error al limpiar archivos antiguos:", err.message);
  }
};

// ✅ Editar (reemplazar) archivo existente
export const updateFile = async (fileId, filePath, newName) => {
  try {
    const auth = await authenticate();
    const drive = google.drive({ version: "v3", auth });

    const media = {
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.update({
      fileId,
      media,
      resource: { name: newName },
      fields: "id, name, webViewLink, webContentLink",
    });

    return response.data;
  } catch (err) {
    console.error("❌ Error al actualizar archivo:", err.message);
    throw err;
  }
};


/* ============================================
   🗑️ ELIMINAR CARPETA (Drive)
   ============================================ */
export const deleteFolder = async (folderId) => {
  const auth = await authenticate();
  const drive = google.drive({ version: "v3", auth });

  // Esto elimina (manda a papelera) la carpeta
  await drive.files.delete({ fileId: folderId });

  return { success: true, folderId };
};