import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Agency {
  name: string;
  phoneNumber: string;
  message: string;
}

const agencies: Agency[] = [
  {
    name: "Agencia Buga",
    phoneNumber: "573176990930", // Reemplaza con el número real
    message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Buga."
  },
  {
    name: "Agencia Cali",
    phoneNumber: "573026810845", // Reemplaza con el número real
    message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Cali."
  },
  {
    name: "Agencia Tuluá",
    phoneNumber: "573241619365", // Reemplaza con el número real
    message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Tuluá."
  },
  {
    name: "Agencia Palmira",
    phoneNumber: "573176962285", // Reemplaza con el número real
    message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Palmira."
  },
  {
    name: "Agencia Manizales",
    phoneNumber: "573122070058", // Reemplaza con el número real
    message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Manizales."
  },
  {
    name: "Agencia Buenaventura",
    phoneNumber: "573132208550", // Reemplaza con el número real
    message: "Hola, me gustaría obtener información sobre los cursos en la Agencia Buenaventura."
  }
];

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAgencyClick = (agency: Agency) => {
    const url = `https://wa.me/${agency.phoneNumber}?text=${encodeURIComponent(agency.message)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  const handleGeneralChat = () => {
    const phoneNumber = "573176990930"; // Número general
    const message = "Hola. Estoy interesado en obtener más información sobre los cursos de Protheger.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay de fondo cuando el panel está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className="fixed bottom-6 right-6 z-50" ref={panelRef}>
        {/* Panel desplegable */}
        <div
          className={`absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-out transform ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
        >
        {/* Header del panel */}
        <div className="bg-[#25D366] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse-green"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Academia Protheger</h3>
              <p className="text-white/80 text-xs">Normalmente responde en un día</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Cerrar panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido del panel */}
        <div className="p-4 bg-[#ECE5DD] min-h-[200px]">
          {/* Mensaje inicial */}
          <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
            <p className="text-sm text-gray-800 mb-2">
              <span className="font-semibold">Academia Protheger</span>
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Hola. Estamos listos para atenderte. ¿Cómo te puedo ayudar?
            </p>
            <div className="space-y-2">
              {agencies.map((agency, index) => (
                <button
                  key={index}
                  onClick={() => handleAgencyClick(agency)}
                  className="w-full text-left text-sm text-[#25D366] hover:text-[#20BA5A] hover:underline transition-all duration-200 flex items-center gap-2 group hover:bg-green-50 rounded px-2 py-1 -mx-2"
                >
                  <MapPin className="h-4 w-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-200" />
                  <span className="group-hover:font-medium transition-all">{agency.name}: Clic aquí</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
              Para consultas generales haz clic en el botón - Iniciar Chat -
            </p>
          </div>
        </div>

        {/* Botón de chat general */}
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleGeneralChat}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Iniciar Chat</span>
          </button>
        </div>
        </div>

        {/* Botón principal de WhatsApp */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className={`h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg transition-all duration-300 ${
            isOpen ? "rotate-180" : "animate-bounce-slow hover:scale-110"
          }`}
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className={`h-7 w-7 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>
    </>
  );
};

export default WhatsAppButton;
