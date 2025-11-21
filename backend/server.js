import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import driveRoutes from "./routes/driveRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import empleateRoutes from "./routes/empleateRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS abierto para cualquier origen (sin credentials)
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Preflight para todas las rutas usando REGEX (no string)
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// Rutas
app.use("/api", driveRoutes);
app.use("/api", contactRoutes);
app.use("/api", empleateRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
