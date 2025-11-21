import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import driveRoutes from "./routes/driveRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import empleateRoutes from "./routes/empleateRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS abierto para cualquier origen (producción, sin credentials)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Preflight para todas las rutas (NO usar "*", usa "/*")
app.options("/*", cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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
