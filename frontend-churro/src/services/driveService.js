const API_URL = "http://localhost:4000/api"; // Cambiar a Render cuando despliegues

// Buscar carpeta por cédula
export async function findFolderByCedula(cedula) {
  const response = await fetch(`${API_URL}/folder/${cedula}`);
  if (!response.ok) {
    throw new Error("No se encontró la carpeta");
  }
  return response.json();
}

// Listar archivos dentro de una carpeta
export async function listFiles(folderId) {
  const response = await fetch(`${API_URL}/list/${folderId}`);
  if (!response.ok) {
    throw new Error("Error al listar archivos");
  }
  return response.json();
}
