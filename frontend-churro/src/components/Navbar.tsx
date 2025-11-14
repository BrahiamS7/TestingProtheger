import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Nuestra Academia", path: "/nuestra-academia" },
    { name: "Nuestros Cursos", path: "/nuestros-cursos" },
    { name: "Consulta Certificados", path: "/consulta-certificados" },
    { name: "Empleate", path: "/empleate" },
    { name: "Quiero Estudiar", path: "/quiero-estudiar" },
  ];

  return (
    <nav className={`bg-background border-b border-border sticky top-0 z-50 shadow-sm ${isMounted ? "navbar-animate" : "opacity-0"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center space-x-2 logo-hover">
            <img src="/logo.webp" alt="Protheger" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-base font-semibold transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "text-primary border-t-2 border-primary pt-2 -mt-2"
                      : "text-foreground hover:text-primary"
                  }`}
                  style={{
                    animation: isMounted ? `slideInLeft 0.4s ease-out ${index * 0.1}s both` : "none"
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-transform duration-300 hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6 transition-transform duration-300 rotate-90" /> : <Menu className="h-6 w-6 transition-transform duration-300" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 text-base font-semibold transition-all duration-300 hover:translate-x-2 ${
                    isActive
                      ? "text-primary border-l-4 border-primary pl-3 -ml-4"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    animation: `slideInLeft 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
