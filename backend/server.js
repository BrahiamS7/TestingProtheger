import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import driveRoutes from "./routes/driveRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import empleateRoutes from "./routes/empleateRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS explícito
const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    // si luego subes tu front a otro dominio, lo agregas aquí
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Primero CORS
app.use(cors(corsOptions));
// ✅ Responder SIEMPRE preflight
app.options("*", cors(corsOptions));

app.use(express.json());

// Rutas
app.use("/api", driveRoutes);
app.use("/api", contactRoutes);
app.use("/api", empleateRoutes);

// Puerto dinámico (Render usa process.env.PORT)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
