import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import estudiante from "@/assets/estudiante.webp";

const QuieroEstudiar = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    celular: "",
    ciudad: "",
    mensaje: "",
  });

  const ciudades = [
    {
      value: "buga",
      label: "Buga",
      coords: "(3.8961104951532177, -76.30024758910682)",
    },
    { value: "cali", label: "Cali", coords: "(3.4702193,-76.5227962)" },
    {
      value: "tulua",
      label: "Tuluá",
      coords: "(4.085160279869318, -76.19272403596482)",
    },
    {
      value: "palmira",
      label: "Palmira",
      coords: "(3.546706905679814, -76.2962529875662)",
    },
    {
      value: "manizales",
      label: "Manizales",
      coords: "(5.0397326, -75.5352316)",
    },
    {
      value: "buenaventura",
      label: "Buenaventura",
      coords: "(3.88930, -77.07589)",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.correo ||
      !formData.celular ||
      !formData.ciudad
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.ok) {
        toast({
          title: "¡Formulario enviado!",
          description: "Nos pondremos en contacto contigo pronto.",
        });
        setFormData({
          nombre: "",
          correo: "",
          celular: "",
          ciudad: "",
          mensaje: "",
        });
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al enviar el formulario.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      toast({
        title: "Error",
        description: "No se pudo conectar con el servidor.",
        variant: "destructive",
      });
    }
  };

  const selectedCity = ciudades.find((c) => c.value === formData.ciudad);
  const [visibleElements, setVisibleElements] = useState<Set<number>>(
    new Set()
  );
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
            src={estudiante}
            alt="estudiante"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white animate-fade-in">
              Quiero Estudiar
            </h1>
          </div>
        </div>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div
              ref={(el) => (elementRefs.current[0] = el)}
              className={`transition-all duration-600 ${
                visibleElements.has(0)
                  ? "scroll-animate-left"
                  : exitedElements.has(0)
                  ? "scroll-animate-out scroll-hidden"
                  : "scroll-hidden"
              }`}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">
                Inscríbete Ahora
              </h2>
              <p className="text-muted-foreground mb-8">
                Completa el formulario y nos pondremos en contacto contigo para
                brindarte toda la información sobre nuestros programas de
                formación.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, correo: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, celular: e.target.value })
                    }
                    placeholder="3001234567"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Select
                    value={formData.ciudad}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ciudad: value })
                    }
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
                  <Label htmlFor="mensaje">Mensaje (Opcional)</Label>
                  <Textarea
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    placeholder="¿Tienes alguna pregunta específica?"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-primary"
                >
                  Enviar Solicitud
                </Button>
              </form>
            </div>

            <div
              ref={(el) => (elementRefs.current[1] = el)}
              className={`transition-all duration-600 ${
                visibleElements.has(1)
                  ? "scroll-animate-right"
                  : exitedElements.has(1)
                  ? "scroll-animate-out scroll-hidden"
                  : "scroll-hidden"
              }`}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">
                Dónde Estamos
              </h2>
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
                    <p className="text-muted-foreground">
                      Selecciona una ciudad para ver el mapa
                    </p>
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

export default QuieroEstudiar;
