import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import NuestraAcademia from "./pages/NuestraAcademia";
import NuestrosCursos from "./pages/NuestrosCursos";
import QuieroEstudiar from "./pages/QuieroEstudiar";
import ConsultaCertificados from "./pages/ConsultaCertificados";
import Empleate from "./pages/Empleate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nuestra-academia" element={<NuestraAcademia />} />
          <Route path="/nuestros-cursos" element={<NuestrosCursos />} />
          <Route path="/quiero-estudiar" element={<QuieroEstudiar />} />
          <Route path="/consulta-certificados" element={<ConsultaCertificados />} />
          <Route path="/empleate" element={<Empleate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
