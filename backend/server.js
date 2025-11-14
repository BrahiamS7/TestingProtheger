import express from "express";
import cors from "cors";
import driveRoutes from "./routes/driveRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", driveRoutes);
app.use("/api", contactRoutes);

app.listen(4000, () => console.log("🚀 Servidor en http://localhost:4000"));
