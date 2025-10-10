import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart, Lock, LogOut, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerTrigger } from "@/components/ui/drawer";
import { PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useAccessCode } from "@/contexts/AccessCodeContext";
import { AccessCodeModal } from "./AccessCodeModal";
import { CartDrawer } from "./CartDrawer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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

  const sendWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de enviar el pedido.",
        variant: "destructive",
      });
      return;
    }

    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${COMPANY_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    // Mostrar modal con enlace de WhatsApp
    showWhatsAppLink(whatsappUrl);

    // Cerrar el dropdown del carrito
    setShowCartDropdown(false);
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
                trigger={
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                }
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
              <CartDrawer 
                open={showCartDropdown} 
                onOpenChange={setShowCartDropdown}
                onCheckout={isAuthenticated ? sendWhatsAppOrder : requestQuote}
                trigger={
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative mt-4 mx-2" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Carrito
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Button>
                  </DrawerTrigger>
                }
              />
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