import { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasExited, setHasExited] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  // Mapeo de ciudades con sus números de WhatsApp y mensajes personalizados
  const cityWhatsAppMap: Record<string, { phoneNumber: string; message: string }> = {
    "BUGA": {
      phoneNumber: "573176990930",
      message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Buga."
    },
    "CALI": {
      phoneNumber: "573026810845",
      message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Cali."
    },
    "TULUÁ": {
      phoneNumber: "573241619365",
      message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Tuluá."
    },
    "PALMIRA": {
      phoneNumber: "573176962285",
      message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Palmira."
    },
    "MANIZALES": {
      phoneNumber: "573122070058",
      message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Manizales."
    },
    "BUENAVENTURA": {
      phoneNumber: "573132208550",
      message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Buenaventura."
    }
  };

  // Mapeo de ciudades con sus enlaces directos de Google Maps
  const cityMapsLinks: Record<string, string> = {
    "BUGA": "https://maps.app.goo.gl/d4wyp1X2KKqJJef66",
    "CALI": "https://maps.app.goo.gl/mbLffvAxwp68cBFg6",
    "TULUÁ": "https://maps.app.goo.gl/t2o1fHQ1kA4oMCPYA",
    "PALMIRA": "https://maps.app.goo.gl/iuTLjk3HBSrWBcP47",
    "MANIZALES": "https://maps.app.goo.gl/mughRBm7aJENbm8dA",
    "BUENAVENTURA": "https://maps.app.goo.gl/Y4U9DFQtuCvxeNA39"
  };

  // Función para convertir número del footer al formato de WhatsApp
  const formatPhoneForWhatsApp = (phone: string, cityName: string): string => {
    // Si existe en el mapa de la ciudad, usar ese número principal
    if (cityWhatsAppMap[cityName]) {
      return cityWhatsAppMap[cityName].phoneNumber;
    }
    // Si no está en el mapa, convertir el formato (remover espacios y agregar código de país si no tiene)
    const cleaned = phone.replace(/\s/g, "");
    return cleaned.startsWith("57") ? cleaned : `57${cleaned}`;
  };

  // Función para crear URL de WhatsApp
  const getWhatsAppUrl = (phone: string, cityName: string): string => {
    const phoneNumber = formatPhoneForWhatsApp(phone, cityName);
    const message = cityWhatsAppMap[cityName]?.message || "Hola, me gustaría obtener información sobre los cursos.";
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // Función para obtener URL de Google Maps
  const getGoogleMapsUrl = (cityName: string): string => {
    return cityMapsLinks[cityName] || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + ", Colombia")}`;
  };

  const cities = [
    {
      name: "BUGA",
      phones: ["315 5425135", "317 6990930"],
      address: "CALLE 3 # 11 - 46\nBARRIO ESTAMBUL"
    },
    {
      name: "CALI",
      phones: ["302 6810845"],
      address: "Calle 33 Norte # 3N-36\nBARRIO PRADOS DEL NORTE"
    },
    {
      name: "TULUÁ",
      phones: ["324 1619365"],
      address: "CALLE 25 # 32 - 15\nBARRIO ALVERNIA"
    },
    {
      name: "PALMIRA",
      phones: ["317 6962285"],
      address: "CALLE 54 # 28 - 27\nBARRIO MIRRIÑAO"
    },
    {
      name: "MANIZALES",
      phones: ["312 2070058"],
      address: "ANTIGUA VIA CHINCHINA TEJARES\nCASA 205"
    },
    {
      name: "BUENAVENTURA",
      phones: ["313 2208550"],
      address: "DIAGONAL 3A # 3a - 52B SUBNIVEL 1\nBARRIO CENTRO"
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://web.facebook.com/prothegeracademia?_rdc=1&_rdr" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/prothegeracademia/?hl=es-la" },
  ];

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <footer 
      ref={footerRef}
      className={`bg-primary text-primary-foreground transition-all duration-600 ${
        isVisible ? "scroll-animate-in" : hasExited ? "scroll-animate-out scroll-hidden" : "scroll-hidden"
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Logo and Slogan */}
        <div className="mb-8 pb-8 border-b border-primary-foreground/20">
          <img 
            src="/logo.webp" 
            alt="Protheger" 
            className="h-16 w-auto object-contain mb-4 transition-transform duration-300 hover:scale-105" 
          />
          <p className="text-primary-foreground/90 mb-4">
            Formamos profesionales integrales en seguridad
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information for Cities - All 6 aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 mb-8 pb-8 border-b border-primary-foreground/20">
          {cities.map((city, index) => (
            <div key={city.name} className={`stagger-animate city-item`}>
              <h4 className="text-lg font-semibold mb-4 transition-colors duration-300 hover:text-secondary">{city.name}</h4>
              <div className="space-y-2 text-sm text-primary-foreground/90">
                <div className="flex flex-col space-y-1">
                  {city.phones.map((phone, index) => (
                    <a
                      key={index}
                      href={getWhatsAppUrl(phone, city.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-2 hover:text-secondary transition-colors cursor-pointer group"
                    >
                      <Phone className="h-4 w-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:underline">CEL: {phone}</span>
                    </a>
                  ))}
                </div>
                <a
                  href={getGoogleMapsUrl(city.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-2 hover:text-secondary transition-colors cursor-pointer group"
                >
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="whitespace-pre-line group-hover:underline">{city.address}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/80">
          <div className="mb-4 md:mb-0 stagger-animate">
            <a
              href="mailto:buga@protheger.com"
              className="flex items-center space-x-2 hover:text-secondary transition-all duration-300 group hover:scale-105"
            >
              <Mail className="h-4 w-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="group-hover:underline">buga@protheger.com</span>
            </a>
          </div>
          <div className="stagger-animate">
            © {new Date().getFullYear()} Protheger. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
