import { uploadFile } from "../certificadosService.js";

uploadFile("1050123456", "./certificados/curso.pdf")
  .then(() => console.log("✅ Archivo subido correctamente"))
  .catch(console.error);
