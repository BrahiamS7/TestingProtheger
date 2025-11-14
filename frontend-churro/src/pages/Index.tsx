import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import FeatureCard from "@/components/FeatureCard";
import ImageTextSection from "@/components/ImageTextSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Award, BadgeCheck, CalendarClock } from "lucide-react";
import academiaExterior from "@/assets/academia-exterior.webp";
import hojaDeVida from "@/assets/Cv.webp";
import practicasCampo from "@/assets/practicas-campo.webp";
import capacitacionOnline from "@/assets/capacitacion-online.jpg";

const Index = () => {
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
        <HeroCarousel />

        {/* Formate con nosotros */}
        <section className="container mx-auto px-4 py-16">
          <h2
            ref={(el) => (elementRefs.current[0] = el)}
            className={`text-4xl font-bold text-center text-primary mb-12 transition-all duration-600 ${
              visibleElements.has(0) ? "scroll-animate-in" : exitedElements.has(0) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
            }`}
          >
            Formate con Nosotros
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "INSTRUCTORES PROFESIONALES CERTIFICADOS",
                description: "Formamos de manera integral al hombre de seguridad con un alto sentido ético, de responsabilidad y metodologías dinámicas de aprendizaje"
              },
              {
                icon: BadgeCheck,
                title: "AUTORIZADOS POR LA SUPERVIGILANCIA",
                description: "Somos una Institución aprobada por la Superintendencia de Vigilancia y Seguridad Privada, que forma profesionales en seguridad privada"
              },
              {
                icon: CalendarClock,
                title: "HORARIOS FLEXIBLES Y CAPACITACIONES PRACTICAS",
                description: "Diseñamos programas ajustados a las necesidades del mercado y de las organizaciones, con horarios flexibles. Prácticas reales en campo"
              }
            ].map((feature, index) => {
              const elementIndex = index + 1;
              const isVisible = visibleElements.has(elementIndex);
              const isExited = exitedElements.has(elementIndex);
              const animationClass = isVisible
                ? index === 0
                  ? "scroll-animate-left"
                  : index === 1
                  ? "scroll-animate-in"
                  : "scroll-animate-right"
                : isExited
                ? "scroll-animate-out scroll-hidden"
                : "scroll-hidden";

              return (
                <div
                  key={index}
                  ref={(el) => (elementRefs.current[elementIndex] = el)}
                  className={animationClass}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Quiénes somos */}
        <div
          ref={(el) => (elementRefs.current[4] = el)}
          className={`transition-all duration-600 ${
            visibleElements.has(4) ? "scroll-animate-in" : exitedElements.has(4) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <ImageTextSection
            image={academiaExterior}
            title="¿Quiénes Somos?"
            description={
              <>
                <p>
                  La Academia De Vigilancia y Seguridad Privada PROTHEGER, es una Institución aprobada por la Superintendencia de Vigilancia y Seguridad Privada, que trabaja para lograr cada día, un excelente reconocimiento por parte de grandes empresas del sector y organizaciones en general, a quienes tenemos el placer de ofrecerles la mejor formación y capacitación para su capital humano.
                </p>
                <p>
                  De la mano de excelentes profesionales, desarrollamos el máximo potencial de nuestros estudiantes y nos esforzamos en aplicar conocimientos en áreas de seguridad que realmente requieren los educandos, para el buen desarrollo de sus actividades laborales en el sector real.
                </p>
              </>
            }
            buttonText="Conózcanos"
            buttonLink="/nuestra-academia"
            imageOnRight={false}
          />
        </div>

        {/* Prácticas en Campo */}
        <div
          ref={(el) => (elementRefs.current[5] = el)}
          className={`transition-all duration-600 ${
            visibleElements.has(5) ? "scroll-animate-in" : exitedElements.has(5) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <ImageTextSection
            image={practicasCampo}
            title="Prácticas en Campo"
            description={
              <>
                <p>
                  Actuamos con integridad en todas las capacitaciones. Trabajamos con munición comprada en INDUMIL, con armas de propiedad de la Academia y docentes altamente calificados respetando la normatividad vigente para cada caso.
                </p>
                <p>
                  Somos una Institución aprobada por la Superintendencia de Vigilancia y Seguridad Privada.
                </p>
              </>
            }
            imageOnRight={true}
          />
        </div>

        {/* Capacítate Online */}
        <div
          ref={(el) => (elementRefs.current[6] = el)}
          className={`transition-all duration-600 ${
            visibleElements.has(6) ? "scroll-animate-in" : exitedElements.has(6) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <ImageTextSection
            image={capacitacionOnline}
            title="Capacítate Online"
            description="Aprende a tu propio ritmo con nuestros cursos virtuales. Accede a contenido de calidad desde cualquier lugar y recibe acompañamiento personalizado de nuestros instructores."
            buttonText="Contáctanos"
            buttonLink="/quiero-estudiar"
            backgroundImage={true}
          />
        </div>

        {/* Envía tu Hoja de Vida */}
        <section
          ref={(el) => (elementRefs.current[7] = el)}
          className={`bg-muted py-16 transition-all duration-600 ${
            visibleElements.has(7) ? "scroll-animate-in" : exitedElements.has(7) ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-bold text-primary">Envía tu Hoja de Vida</h2>
                <p className="text-lg text-muted-foreground">
                  ¿Tienes formación en seguridad privada? ¿Te formaste con nosotros? Envía tu hoja de vida. tenemos convenios con importantes empresas del sector que permiten posibilidades de empleo para nuestros estudiantes.
                </p>
                <button
                  onClick={() => window.location.href = "/empleate"}
                  className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Postúlate Ahora
                </button>
              </div>
              <div className="flex-1">
                <img
                  src={hojaDeVida}
                  alt="Oportunidades laborales"
                  className="w-full rounded-lg shadow-lg"
                  loading="lazy"
                />
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

export default Index;
