import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessCodeProvider } from "@/contexts/AccessCodeContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Header from "./components/Header";
import Index from "./pages/Index";
import Nosotros from "./pages/Nosotros";
import Productos from "./pages/Productos";
import Beneficios from "./pages/Beneficios";
import Recetas from "./pages/Recetas";
import Clientes from "./pages/Clientes";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import ProtectedAdmin from "./pages/ProtectedAdmin";
import AdminAuth from "./pages/AdminAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AccessCodeProvider>
          <CartProvider>
            <AdminProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/productos" element={<Productos />} />
                  <Route path="/beneficios" element={<Beneficios />} />
                  <Route path="/recetas" element={<Recetas />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin-auth" element={<AdminAuth />} />
                  <Route path="/admin" element={<ProtectedAdmin />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              </BrowserRouter>
            </AdminProvider>
          </CartProvider>
        </AccessCodeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
