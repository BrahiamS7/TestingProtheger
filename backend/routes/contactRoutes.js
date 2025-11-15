import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // <--- Carga el .env

const router = express.Router();

// 📨 Ruta para recibir el formulario
router.post("/contact", async (req, res) => {
  const { nombre, correo, celular, ciudad, mensaje } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // 💡 viene del .env
        pass: process.env.EMAIL_PASS, // 💡 viene del .env
      },
    });

    const mailOptions = {
      from: `"Formulario PROTHEGER" <${process.env.EMAIL_USER}>`,
      to: "bfsoto16@yopmail.com", // correo que recibe la solicitud
      subject: "Nueva solicitud de estudiante",
      html: `
        <h2>📋 Nueva solicitud recibida</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Celular:</b> ${celular}</p>
        <p><b>Ciudad:</b> ${ciudad}</p>
        <p><b>Mensaje:</b> ${mensaje || "Sin mensaje adicional"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ ok: true, msg: "Correo enviado correctamente" });

  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    res.status(500).json({ ok: false, msg: "Error al enviar el correo" });
  }
});

export default router;
