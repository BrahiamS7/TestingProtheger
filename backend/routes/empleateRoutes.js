import { Resend } from "resend";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });



dotenv.config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/empleate", upload.single("archivo"), async (req, res) => {
  const { nombre, correo, celular, formacion, ciudad } = req.body;

  if (!req.file) {
    return res.status(400).json({ ok: false, msg: "Falta el archivo" });
  }

  try {
    const response = await resend.emails.send({
      from: "PROTHEGER <onboarding@resend.dev>",
      to: "certificacion.protheger@gmail.com",
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
          content: req.file.buffer.toString("base64"),
        },
      ],
    });

    res.json({ ok: true, msg: "Hoja de vida enviada correctamente" });
  } catch (error) {
    console.error("ERROR RESEND:", error);
    res.status(500).json({ ok: false, msg: "Error al enviar correo" });
  }
});

export default router;