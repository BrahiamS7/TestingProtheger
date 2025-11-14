import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import cursoVigilancia from "@/assets/curso-vigilancia.jpg";
import cursoEscoltas from "@/assets/002.webp";
import cursoTecnologia from "@/assets/curso-tecnologia.jpg";
import cursoSupervisor from "@/assets/curso-supervisor.jpg";
import academiaExterior from "@/assets/001.webp";

const NuestrosCursos = () => {
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const [exitedElements, setExitedElements] = useState<Set<number>>(new Set());
  const elementRefs = useRef<(HTMLElement | null)[]>([]);

  const cursos = [
    {
      title: "Vigilancia y Seguridad Privada",
      image: cursoVigilancia,
      description: "Formación integral en técnicas de vigilancia, protección de personas y bienes, y normatividad vigente.",
    },
    {
      title: "Escoltas Personal y Corporativo",
      image: cursoEscoltas,
      description: "Entrenamiento especializado en protección ejecutiva, manejo de situaciones de riesgo y técnicas defensivas.",
    },
    {
      title: "Medios Tecnológicos de Seguridad",
      image: cursoTecnologia,
      description: "Capacitación en sistemas de vigilancia electrónica, CCTV, alarmas y control de acceso.",
    },
    {
      title: "Supervisor de Seguridad",
      image: cursoSupervisor,
      description: "Programa avanzado para líderes en seguridad, gestión de equipos y coordinación de operaciones.",
    },
  ];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Pequeño delay para asegurar que los elementos estén renderizados
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
            src={academiaExterior}
            alt="Nuestra Academia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white animate-fade-in">Nuestros Cursos</h1>
          </div>
        </div>

        <section className="container mx-auto px-4 py-16">
          <p
            ref={(el) => (elementRefs.current[0] = el)}
            className={`text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto transition-all duration-600 ${
              visibleElements.has(0) ? "scroll-animate-in" : exitedElements.has(0) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
            }`}
          >
            Ofrecemos programas de formación especializados en diferentes áreas de la seguridad. Todos nuestros cursos incluyen certificación avalada y prácticas en campo.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {cursos.map((curso, index) => {
              const elementIndex = index + 1;
              const isVisible = visibleElements.has(elementIndex);
              const isExited = exitedElements.has(elementIndex);
              const animationClass = isVisible
                ? index % 2 === 0
                  ? "scroll-animate-left"
                  : "scroll-animate-right"
                : isExited
                ? "scroll-animate-out scroll-hidden"
                : "scroll-hidden";

              return (
                <Card
                  key={index}
                  ref={(el) => (elementRefs.current[elementIndex] = el)}
                  className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${animationClass}`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={curso.image}
                      alt={curso.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                      {curso.title}
                    </h3>
                    <p className="text-muted-foreground">{curso.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section
          ref={(el) => (elementRefs.current[5] = el)}
          className={`bg-gradient-primary py-16 text-white transition-all duration-600 ${
            visibleElements.has(5) ? "scroll-animate-in" : exitedElements.has(5) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Fórmate con Nosotros</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              De la mano de excelentes profesionales, desarrollamos el máximo potencial de nuestros estudiantes y nos esforzamos en aplicar conocimientos en áreas de seguridad que realmente requieren los educandos, para el buen desarrollo de sus actividades laborales en el sector real.
            </p>
            <button
              onClick={() => window.location.href = "/quiero-estudiar"}
              className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Inscríbete Ahora
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default NuestrosCursos;
