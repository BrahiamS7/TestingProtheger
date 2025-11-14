import { createCedulaFolder } from "../certificadosService.js";

createCedulaFolder("1050123456")
  .then(() => console.log("✅ Prueba completada"))
  .catch(console.error);
