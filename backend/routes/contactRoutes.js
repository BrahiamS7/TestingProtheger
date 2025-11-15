import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// 📨 Ruta para recibir el formulario
router.post("/contact", async (req, res) => {
  const { nombre, correo, celular, ciudad, mensaje } = req.body;

  try {
    await resend.emails.send({
      from: "PROTHEGER <onboarding@resend.dev>",
      to: "bfsoto16@yopmail.com",
      subject: "Nueva solicitud de estudiante",
      html: `
        <h2>📋 Nueva solicitud recibida</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Celular:</b> ${celular}</p>
        <p><b>Ciudad:</b> ${ciudad}</p>
        <p><b>Mensaje:</b> ${mensaje || "Sin mensaje adicional"}</p>
      `,
    });

    res.status(200).json({ ok: true, msg: "Correo enviado correctamente" });

  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ ok: false, msg: "Error al enviar el correo" });
  }
});

export default router;
