import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 📁 Configurar multer (archivos temporales)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/empleate", upload.single("archivo"), async (req, res) => {
  const { nombre, correo, celular, formacion, ciudad } = req.body;

  if (!req.file) {
    return res.status(400).json({ ok: false, msg: "Falta el archivo" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Empléate PROTHEGER" <${process.env.EMAIL_USER}>`,
      to: "bfsoto16@yopmail.com",
      subject: "📄 Nueva hoja de vida recibida",
      html: `
        <h2>📥 Nueva solicitud de empleo</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Celular:</b> ${celular}</p>
        <p><b>Formación:</b> ${formacion}</p>
        <p><b>Ciudad:</b> ${ciudad}</p>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({ ok: true, msg: "Hoja de vida enviada correctamente" });
  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
    res.status(500).json({ ok: false, msg: "Error al enviar el correo" });
  }
});

export default router;
