import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageTextSection from "@/components/ImageTextSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import academiaExterior from "@/assets/academia-exterior.webp";
import hero2 from "@/assets/hero-2.jpg";
import hero4 from "@/assets/hero-4.jpg";

const NuestraAcademia = () => {
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const [exitedElements, setExitedElements] = useState<Set<number>>(new Set());
  const elementRefs = useRef<(HTMLElement | null)[]>([]);

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
            <h1 className="text-5xl font-bold text-white animate-fade-in">Nuestra Academia</h1>
          </div>
        </div>

        <div
          ref={(el) => (elementRefs.current[0] = el)}
          className={`transition-all duration-600 ${
            visibleElements.has(0) ? "scroll-animate-in" : exitedElements.has(0) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <ImageTextSection
            image={hero2}
            title="Sobre Nosotros"
            description="Somos una Academia de Vigilancia y Seguridad Privada, que garantiza sus servicios de formación para el trabajo y desarrollo humano, cubriendo las necesidades de nuestros clientes, bajo el total cumplimiento de la normatividad legal establecida por la Constitución Nacional de Colombia y con resolución autorizada por la Superintendencia de Vigilancia y Seguridad Privada."
            imageOnRight={false}
          />
        </div>

        <div
          ref={(el) => (elementRefs.current[1] = el)}
          className={`bg-muted py-16 transition-all duration-600 ${
            visibleElements.has(1) ? "scroll-animate-in" : exitedElements.has(1) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <ImageTextSection
            image={hero4}
            title="Nuestra Visión"
            description="La Academia de Vigilancia y Seguridad Privada PROTHEGER LTDA. será reconocida como un aliado estratégico de formación en el sector, como una Institución de formación para el trabajo y desarrollo humano, líder en la formación de profesionales en servicios de protección integral; Así mismo, se destacará por la idoneidad del talento humano, sus docentes especializados en las diferentes áreas de conocimiento, procesos de innovación, bienestar y proyección social cimentados en una cultura de alta calidad."
            imageOnRight={true}
          />
        </div>

        <div
          ref={(el) => (elementRefs.current[2] = el)}
          className={`transition-all duration-600 ${
            visibleElements.has(2) ? "scroll-animate-in" : exitedElements.has(2) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <ImageTextSection
            image={hero2}
            title="Nuestra Misión"
            description="LA ACADEMIA DE VIGILANCIA Y SEGURIDAD PRIVADA PROTHEGER LTDA es una institución de formación para el trabajo y desarrollo humano, cuyo propósito fundamental es la capacitación en las áreas de la Vigilancia y Seguridad Privada, formando de manera integral profesionales con un alto sentido ético, de responsabilidad y metodologías dinámicas de aprendizaje."
            imageOnRight={false}
          />
        </div>

        <section
          ref={(el) => (elementRefs.current[3] = el)}
          className={`bg-gradient-primary py-16 text-white transition-all duration-600 ${
            visibleElements.has(3) ? "scroll-animate-in" : exitedElements.has(3) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
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
              Contáctanos
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default NuestraAcademia;
