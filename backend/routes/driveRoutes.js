import express from "express";
import multer from "multer";
import fs from "fs";
import { google } from "googleapis";
import { authenticate } from "../config/googleDriveConfig.js";
import {
  createFolder,
  uploadFile,
  listFiles,
  deleteFile,
  updateFile,
  deleteFolder, // ✅ nuevo
} from "../services/driveService.js";

const router = express.Router();
const upload = multer({ dest: "backend/certificados/" });

/* ============================================
   🔍 BUSCAR CARPETA POR CÉDULA
   ============================================ */
router.get("/folder/:cedula", async (req, res) => {
  try {
    const { cedula } = req.params;

    // ✅ Obtener cliente autenticado
    const auth = await authenticate(); // ✅ llama la función
    const drive = google.drive({ version: "v3", auth });

    // 🔎 Buscar carpeta
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${cedula}' and trashed=false`,
      fields: "files(id, name)",
    });

    if (response.data.files.length === 0) {
      return res.status(404).json({ message: "Carpeta no encontrada" });
    }

    const folder = response.data.files[0];
    res.json({ folderId: folder.id, name: folder.name });
  } catch (error) {
    console.error("❌ Error buscando carpeta:", error);
    res
      .status(500)
      .json({ message: "Error buscando carpeta", error: error.message });
  }
});

/* ============================================
   📁 CREAR CARPETA
   ============================================ */
router.post("/folder/:cedula", async (req, res) => {
  try {
    const parentId = process.env.GOOGLE_ROOT_FOLDER_ID;

    const folder = await createFolder(req.params.cedula, parentId);

    res.json(folder);
  } catch (err) {
    console.error("❌ Error al crear carpeta:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   📤 SUBIR ARCHIVO
   ============================================ */
router.post("/upload/:folderId", upload.single("file"), async (req, res) => {
  try {
    console.log("📤 Subiendo archivo...");
    console.log("➡️ Carpeta destino:", req.params.folderId);
    console.log("📄 Archivo recibido:", req.file);

    const file = await uploadFile(
      req.params.folderId,
      req.file.path,
      req.file.originalname
    );

    fs.unlinkSync(req.file.path); // 🧹 Eliminar temporal
    console.log("✅ Archivo subido correctamente:", file);
    res.json({ success: true, file });
  } catch (err) {
    console.error("❌ Error al subir archivo:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   📋 LISTAR ARCHIVOS DE UNA CARPETA
   ============================================ */
router.get("/list/:folderId", async (req, res) => {
  try {
    console.log("📁 Solicitando lista para folderId:", req.params.folderId);
    const files = await listFiles(req.params.folderId);
    console.log("✅ Archivos obtenidos:", files);
    res.json(files);
  } catch (error) {
    console.error("❌ Error al listar archivos:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================================
   🗑️ ELIMINAR ARCHIVO
   ============================================ */
router.delete("/delete/:fileId", async (req, res) => {
  try {
    await deleteFile(req.params.fileId);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error al eliminar archivo:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   ✏️ ACTUALIZAR (EDITAR) ARCHIVO
   ============================================ */
router.put("/update/:fileId", upload.single("file"), async (req, res) => {
  try {
    console.log("✏️ Editando archivo...");
    console.log("➡️ Archivo destino:", req.params.fileId);
    console.log("📄 Archivo nuevo:", req.file);

    const file = await updateFile(
      req.params.fileId,
      req.file.path,
      req.file.originalname
    );

    fs.unlinkSync(req.file.path); // 🧹 Eliminar temporal
    console.log("✅ Archivo actualizado correctamente:", file);
    res.json({ success: true, file });
  } catch (err) {
    console.error("❌ Error al actualizar archivo:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   📥 DESCARGAR ARCHIVO
   ============================================ */
router.get("/download/:fileId", async (req, res) => {
  try {
    const auth = await authenticate();
    const drive = google.drive({ version: "v3", auth });
    const { fileId } = req.params;

    const fileInfo = await drive.files.get({
      fileId,
      fields: "name, mimeType",
    });

    const fileName = fileInfo.data.name;
    const mimeType = fileInfo.data.mimeType;

    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", mimeType);

    response.data.pipe(res);
  } catch (error) {
    console.error("❌ Error al descargar archivo:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================================
   🗑️ ELIMINAR CARPETA
   ============================================ */
router.delete("/folder/:folderId", async (req, res) => {
  try {
    const { folderId } = req.params;

    const result = await deleteFolder(folderId);

    res.json(result);
  } catch (err) {
    console.error("❌ Error al eliminar carpeta:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
