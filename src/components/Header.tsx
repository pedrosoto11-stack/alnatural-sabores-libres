import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Lock, LogOut, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useAccessCode } from "@/contexts/AccessCodeContext";
import { AccessCodeModal } from "./AccessCodeModal";
import { CartDrawer } from "./CartDrawer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import logoAlNatural from "@/assets/logo-al-natural-new.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState("");
  const { cartItems, getTotalItems, showCartDropdown, setShowCartDropdown, clearCart } = useCart();
  const { isAuthenticated, client, logout } = useAccessCode();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Número de WhatsApp de la empresa (puedes cambiarlo aquí)
  const COMPANY_WHATSAPP = "+584124566318";

  // Función para mostrar modal con enlace de WhatsApp
  const showWhatsAppLink = (url: string) => {
    setWhatsAppUrl(url);
    setShowWhatsAppModal(true);
  };

  // Función para copiar enlace al portapapeles
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Enlace copiado",
        description: "El enlace de WhatsApp se ha copiado al portapapeles.",
      });
    } catch (err) {
      console.error('Error al copiar:', err);
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace. Intenta seleccionarlo manualmente.",
        variant: "destructive",
      });
    }
  };

  // Función para intentar abrir WhatsApp
  const tryOpenWhatsApp = (url: string) => {
    try {
      if (isMobile) {
        window.open(url, '_blank');
      } else {
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Error al abrir WhatsApp:', err);
    }
  };

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return "";

    let message = `¡Hola! Quisiera hacer el siguiente pedido desde Al Natural:\n\n`;
    message += `📋 *DETALLES DEL PEDIDO:*\n`;
    message += `👤 Cliente: ${client?.name || "Cliente"}\n`;
    if (client?.company) {
      message += `🏢 Empresa: ${client.company}\n`;
    }
    message += `📧 Email: ${client?.email || "No especificado"}\n\n`;

    message += `🛒 *PRODUCTOS:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      if (item.variant) {
        message += `   📝 Variante: ${item.variant}\n`;
      }
      message += `   📦 Cantidad: ${item.quantity}\n`;
      if (isAuthenticated) {
        message += `   💰 Precio unitario: $${item.price.toFixed(2)}\n`;
        message += `   💸 Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`;
      }
      message += `\n`;
    });

    if (isAuthenticated) {
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      message += `💳 *TOTAL DEL PEDIDO: $${total.toFixed(2)}*\n\n`;
    }

    message += `📅 Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
    message += `🕐 Hora: ${new Date().toLocaleTimeString('es-ES')}\n\n`;
    message += `¡Gracias por su atención! 😊`;

    return message;
  };

  const sendWhatsAppOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de enviar el pedido.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. PRIMERO: Guardar pedido en base de datos local
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast({
          title: "Error de autenticación",
          description: "Debes iniciar sesión para hacer un pedido",
          variant: "destructive"
        });
        return;
      }

      // Mapeo de IDs de productos a UUIDs del DASHBOARD
      const PRODUCT_UUID_MAP: { [key: string]: string } = {
        // Fajitas
        "fajita-yuca": "92d12d3e-ff77-409f-8f4e-195c6597b15f",
        "fajita-yuca-pimenton": "c0250dee-133e-4649-8626-25c78fe5f436",
        "fajita-yuca-zanahoria": "0fe90920-ec28-47cf-a924-ded9c87c3d46",
        "fajita-yuca-acelga-espinaca": "e99a52a5-00df-4011-9fa9-5480a6c9f7a5",
        "fajita-yuca-oregano": "8b335908-97d5-49a9-a176-ad88ad2c808d",
        "fajita-platano-amarillo": "c8b7d4f0-f641-49b8-ae73-1ab0c68f382d",
        "fajita-platano-verde": "eb814463-795b-42f1-8e3d-f2cfff4dfc49",
        "fajita-cambur-verde": "c6da722c-4a71-40c1-a2e7-c3da920aa4c2",
        
        // Tequeños
        "tequenos-yuca-queso": "7ca0c1b7-2794-4c68-9ec6-349e6bea221d",
        "tequenos-platano-verde-queso": "bdc7bc75-687b-4976-8232-df884f5a79e7",
        "tequenos-platano-amarillo-queso": "3f214f50-169f-414d-9176-3f2ab5d4b3b8",
        "tequenos-combinados-queso": "1296abbb-4266-40fe-b5d4-9c133f0f7e51",
        "tequenos-al-natural": "7ca0c1b7-2794-4c68-9ec6-349e6bea221d",
        
        // Panes
        "panes-yuca-queso-12": "55c35b8f-9e74-4c5d-8efd-552f314f44e5",
        "panes-yuca-queso-4": "a97b5d31-63c8-48de-af11-a181bb63d237",
        
        // Patacones
        "patacones": "1f7bed1d-c07b-4c48-b723-5df26c0d353c",
        "patacones-gourmet": "1f7bed1d-c07b-4c48-b723-5df26c0d353c",
        
        // Arepas
        "arepa-platano-verde": "0b79763b-44b8-4f5b-98a8-c0848fefa9e4",
        "arepa-platano-verde-ajo-perejil": "a8fa22b6-b72a-48ce-abe5-5f9028f159d3",
        "arepa-platano-amarillo": "556b3d88-a586-4dbc-ac1c-3ebf9eeb6edf",
        "arepa-cambur-verde": "27901f18-12c0-4141-809b-dbb3133faf92",
        "arepa-yuca": "bca9391c-f0e2-4675-852b-729bc6c1220e",
        "arepa-yuca-mixta-6-sabores": "f56338dc-98bb-4d01-ad4b-bf2529fb1997",
        "arepa-yuca-mixta": "f56338dc-98bb-4d01-ad4b-bf2529fb1997",
        "arepa-reina-pepiada": "0b79763b-44b8-4f5b-98a8-c0848fefa9e4",
        
        // Wraps
        "wrap-saludable-fajitas": "92d12d3e-ff77-409f-8f4e-195c6597b15f",
      };

      // Convertir IDs a UUIDs del dashboard, manteniendo el nombre específico
      const orderItems = cartItems.map(item => ({
        product_id: PRODUCT_UUID_MAP[item.id] || item.id,
        product_name: item.name, // El nombre específico de la variante se mantiene
        quantity: item.quantity,
        unit_price: item.price
      }));

      // Llamar al edge function place-order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('place-order', {
        body: { 
          items: orderItems, 
          notes: '' 
        }
      });

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast({
          title: "Error al crear pedido",
          description: "No se pudo registrar el pedido. Por favor intenta nuevamente.",
          variant: "destructive"
        });
        return;
      }

      // 2. SEGUNDO: Generar mensaje WhatsApp
      const message = generateWhatsAppMessage();
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${COMPANY_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
      
      // 3. Mostrar modal con enlace
      showWhatsAppLink(whatsappUrl);
      
      // 4. Limpiar carrito
      clearCart();
      
      // 5. Cerrar el dropdown del carrito
      setShowCartDropdown(false);
      
      // 6. Mostrar confirmación
      toast({
        title: "¡Pedido registrado!",
        description: `Pedido #${orderData.orderId.substring(0, 8)} creado exitosamente`,
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error. Por favor contacta a soporte.",
        variant: "destructive"
      });
    }
  };

  const requestQuote = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de solicitar cotización.",
        variant: "destructive",
      });
      return;
    }

    let message = `¡Hola! Me gustaría solicitar una cotización para los siguientes productos de Al Natural:\n\n`;
    message += `🛒 *PRODUCTOS:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      if (item.variant) {
        message += `   📝 Variante: ${item.variant}\n`;
      }
      message += `   📦 Cantidad: ${item.quantity}\n\n`;
    });

    message += `📅 Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
    message += `🕐 Hora: ${new Date().toLocaleTimeString('es-ES')}\n\n`;
    message += `¿Podrían proporcionarme una cotización para estos productos? ¡Gracias! 😊`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${COMPANY_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Mostrar modal con enlace de WhatsApp
    showWhatsAppLink(whatsappUrl);

    // Cerrar el dropdown del carrito
    setShowCartDropdown(false);
  };

  const navigationItems = [
    { path: "/", label: "Inicio" },
    { path: "/nosotros", label: "Nosotros" },
    { path: "/productos", label: "Productos" },
    { path: "/beneficios", label: "Beneficios" },
    { path: "/recetas", label: "Recetas" },
    { path: "/clientes", label: "Clientes" },
    { path: "/contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <img 
              src={logoAlNatural} 
              alt="Al Natural" 
              className="h-20 w-auto object-contain"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground"
                  }`
                }
                end={item.path === "/"}
              >
                {item.label}
              </NavLink>
            ))}
            
            <div className="flex items-center space-x-3">
              {/* Access Code Button */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Lock className="h-4 w-4" />
                      <span className="text-xs">{client?.name || "Distribuidor"}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAccessModal(true)}
                  className="flex items-center space-x-1"
                >
                  <Lock className="h-4 w-4" />
                  <span>Tengo código</span>
                </Button>
              )}
              
              {/* Cart */}
              <CartDrawer 
                open={showCartDropdown} 
                onOpenChange={setShowCartDropdown}
                onCheckout={isAuthenticated ? sendWhatsAppOrder : requestQuote}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-3 pt-4">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary px-2 py-1 ${
                      isActive ? "text-primary font-semibold" : "text-muted-foreground"
                    }`
                  }
                  end={item.path === "/"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-4 mx-2" onClick={() => setIsMenuOpen(false)}>
                <CartDrawer 
                  open={showCartDropdown} 
                  onOpenChange={setShowCartDropdown}
                  onCheckout={isAuthenticated ? sendWhatsAppOrder : requestQuote}
                />
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <AccessCodeModal 
        isOpen={showAccessModal} 
        onClose={() => setShowAccessModal(false)} 
      />

      {/* WhatsApp Link Modal */}
      <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enlace de WhatsApp</DialogTitle>
            <DialogDescription>
              Copia este enlace y pégalo en tu navegador, o haz clic en "Abrir WhatsApp" para intentar abrirlo automáticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <label htmlFor="whatsapp-link" className="sr-only">
                  Enlace de WhatsApp
                </label>
                <input
                  id="whatsapp-link"
                  defaultValue={whatsAppUrl}
                  readOnly
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button size="sm" className="px-3" onClick={() => copyToClipboard(whatsAppUrl)}>
                <span className="sr-only">Copiar</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => {
                  tryOpenWhatsApp(whatsAppUrl);
                  setShowWhatsAppModal(false);
                }} 
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir WhatsApp
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowWhatsAppModal(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;