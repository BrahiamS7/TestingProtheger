import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import certificados from "@/assets/Certificados.webp";
import { findFolderByCedula, listFiles } from "@/services/driveService";

const ConsultaCertificados = () => {
  const { toast } = useToast();
  const [cedula, setCedula] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasExited, setHasExited] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasExited(false);
        } else {
          setHasExited(true);
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cedula) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu número de cédula.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setFiles([]);

    try {
      toast({
        title: "Consultando...",
        description:
          "Estamos verificando tu certificado en nuestra base de datos.",
      });

      const folder = await findFolderByCedula(cedula);
      const filesList = await listFiles(folder.folderId);
      setFiles(filesList);

      toast({
        title: "Certificados encontrados ✅",
        description: `Se encontraron ${filesList.length} archivos.`,
      });
    } catch (error) {
      toast({
        title: "No encontrado ❌",
        description: "No se encontró un certificado con esa cédula.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="relative h-[300px] overflow-hidden">
          <img
            src={certificados}
            alt="ConsultaCertificados"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white animate-fade-in">
              Consulta de Certificados
            </h1>
          </div>
        </div>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card
              ref={cardRef}
              className={`shadow-lg transition-all duration-600 ${
                isVisible
                  ? "scroll-animate-in"
                  : hasExited
                  ? "scroll-animate-out scroll-hidden"
                  : "scroll-hidden"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-3xl text-center text-primary">
                  Verifica tu Certificado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Ingresa tu número de cédula para consultar el estado y validez
                  de tu certificado.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="cedula">Número de Cédula *</Label>
                    <div className="relative">
                      <Input
                        id="cedula"
                        type="text"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        placeholder="1234567890"
                        className="pr-10"
                        required
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary"
                  >
                    Consultar Certificado
                  </Button>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="relative cursor-pointer bg-white p-2 rounded-lg shadow hover:shadow-md"
                      onClick={() => setSelectedFile(file)} // 👈 abre visor grande
                    >
                      {file.mimeType.startsWith("image/") ? (
                        <img
                          src={`https://drive.google.com/uc?export=view&id=${file.id}`}
                          alt={file.name}
                          className="w-full h-40 object-cover rounded"
                        />
                      ) : (
                        <iframe
                          src={`https://drive.google.com/file/d/${file.id}/preview`}
                          className="w-full h-40 rounded"
                          title={file.name}
                        ></iframe>
                      )}
                      <p className="mt-2 text-sm text-center font-medium truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedFile && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg p-4 max-w-5xl w-full h-[90vh] flex flex-col">
                      {/* Botón cerrar */}
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl font-bold"
                      >
                        ×
                      </button>

                      <h2 className="text-lg font-semibold mb-2 text-center truncate">
                        {selectedFile.name}
                      </h2>

                      {selectedFile.mimeType.startsWith("image/") ? (
                        <img
                          src={`https://drive.google.com/uc?export=view&id=${selectedFile.id}`}
                          alt={selectedFile.name}
                          className="flex-1 object-contain rounded"
                        />
                      ) : (
                        <iframe
                          src={`https://drive.google.com/file/d/${selectedFile.id}/preview`}
                          className="flex-1 rounded"
                          title={selectedFile.name}
                        ></iframe>
                      )}

                      <a
                        href={`https://drive.google.com/uc?id=${selectedFile.id}&export=download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-center text-blue-600 font-medium hover:underline"
                      >
                        Descargar archivo
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-primary mb-3">
                    Información Importante:
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Los certificados son válidos a nivel nacional</li>
                    <li>
                      • Asegúrate de ingresar tu número de cédula correctamente
                    </li>
                    <li>• Si tienes problemas, contáctanos directamente</li>
                    <li>• El proceso de verificación es instantáneo</li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    ¿No encuentras tu certificado? <br />
                    <a
                      href="/quiero-estudiar"
                      className="text-primary hover:text-secondary font-semibold"
                    >
                      Contáctanos aquí
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ConsultaCertificados;
