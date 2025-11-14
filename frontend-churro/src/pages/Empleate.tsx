import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import empleate from "@/assets/empleate.webp";

const Empleate = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    formacion: "",
    ciudad: "",
  });
  const [archivo, setArchivo] = useState<File | null>(null);

  const ciudades = [
    { value: "buga", label: "Buga", coords: "3.9009,-76.2978" },
    { value: "cali", label: "Cali", coords: "3.4516,-76.5320" },
    { value: "tulua", label: "Tuluá", coords: "4.0848,-76.1953" },
    { value: "palmira", label: "Palmira", coords: "3.5394,-76.3036" },
    { value: "manizales", label: "Manizales", coords: "5.0700,-75.5138" },
    { value: "buenaventura", label: "Buenaventura", coords: "3.8801,-77.0310" },
  ];

  const formaciones = [
    { value: "vigilancia", label: "Vigilancia" },
    { value: "escoltas", label: "Escoltas" },
    { value: "medios-tecnologicos", label: "Medios Tecnológicos" },
    { value: "supervisor", label: "Supervisor" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.correo || !formData.celular || !formData.formacion || !formData.ciudad) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    if (!archivo) {
      toast({
        title: "Error",
        description: "Por favor adjunta tu hoja de vida.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "¡Hoja de vida enviada!",
      description: "Revisaremos tu perfil y nos contactaremos pronto.",
    });

    setFormData({
      nombre: "",
      correo: "",
      celular: "",
      formacion: "",
      ciudad: "",
    });
    setArchivo(null);
  };

  const selectedCity = ciudades.find((c) => c.value === formData.ciudad);
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const [exitedElements, setExitedElements] = useState<Set<number>>(new Set());
  const elementRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const timeoutId = setTimeout(() => {
      elementRefs.current.forEach((element, index) => {
        if (!element) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleElements((prev) => new Set(prev).add(index));
              setExitedElements((prev) => {
                const next = new Set(prev);
                next.delete(index);
                return next;
              });
            } else {
              setExitedElements((prev) => new Set(prev).add(index));
              setVisibleElements((prev) => {
                const next = new Set(prev);
                next.delete(index);
                return next;
              });
            }
          },
          {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
          }
        );

        observer.observe(element);
        observers.push(observer);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="relative h-[300px] overflow-hidden">
          <img
            src={empleate}
            alt="Empléate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white animate-fade-in">Empléate</h1>
          </div>
        </div>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div
              ref={(el) => (elementRefs.current[0] = el)}
              className={`transition-all duration-600 ${
                visibleElements.has(0) ? "scroll-animate-left" : exitedElements.has(0) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
              }`}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">
                Envía tu Hoja de Vida
              </h2>
              <p className="text-muted-foreground mb-8">
                Tenemos convenios con las mejores empresas del sector. Comparte tu hoja de vida con nosotros y te conectaremos con excelentes oportunidades laborales.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="correo">Correo Electrónico *</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="celular">Número de Celular *</Label>
                  <Input
                    id="celular"
                    type="tel"
                    value={formData.celular}
                    onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                    placeholder="3001234567"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="formacion">Formación *</Label>
                  <Select
                    value={formData.formacion}
                    onValueChange={(value) => setFormData({ ...formData, formacion: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu formación" />
                    </SelectTrigger>
                    <SelectContent>
                      {formaciones.map((formacion) => (
                        <SelectItem key={formacion.value} value={formacion.value}>
                          {formacion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Select
                    value={formData.ciudad}
                    onValueChange={(value) => setFormData({ ...formData, ciudad: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((ciudad) => (
                        <SelectItem key={ciudad.value} value={ciudad.value}>
                          {ciudad.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="archivo">Hoja de Vida (PDF) *</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="archivo"
                      className="flex items-center justify-center w-full h-32 px-4 transition bg-muted border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/80"
                    >
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {archivo ? archivo.name : "Haz clic para cargar tu CV"}
                        </div>
                      </div>
                      <input
                        id="archivo"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-primary">
                  Enviar Hoja de Vida
                </Button>
              </form>
            </div>

            <div
              ref={(el) => (elementRefs.current[1] = el)}
              className={`transition-all duration-600 ${
                visibleElements.has(1) ? "scroll-animate-right" : exitedElements.has(1) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
              }`}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">Dónde Estamos</h2>
              <p className="text-muted-foreground mb-6">
                {selectedCity
                  ? `Sede ${selectedCity.label}`
                  : "Selecciona una ciudad para ver su ubicación"}
              </p>

              <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
                {selectedCity ? (
                  <iframe
                    src={`https://www.google.com/maps?q=${selectedCity.coords}&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={`Mapa de ${selectedCity.label}`}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Selecciona una ciudad para ver el mapa</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Empleate;
