import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import driveRoutes from "./routes/driveRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import empleateRoutes from "./routes/empleateRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", driveRoutes);
app.use("/api", contactRoutes);
app.use("/api", empleateRoutes);

// Puerto dinámico (Render usa process.env.PORT)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
