import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart, Lock, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useAccessCode } from "@/contexts/AccessCodeContext";
import { AccessCodeModal } from "./AccessCodeModal";
import { useToast } from "@/hooks/use-toast";
import logoAlNatural from "@/assets/logo-al-natural.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const { cartItems, getTotalItems, showCartDropdown, setShowCartDropdown, clearCart } = useCart();
  const { isAuthenticated, client, logout } = useAccessCode();
  const { toast } = useToast();

  // Número de WhatsApp de la empresa (puedes cambiarlo aquí)
  const COMPANY_WHATSAPP = "+584144089365";

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
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Mostrar toast de confirmación
    toast({
      title: "Pedido enviado",
      description: "Se ha abierto WhatsApp con tu pedido. Solo presiona enviar para completarlo.",
    });

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
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Mostrar toast de confirmación
    toast({
      title: "Solicitud de cotización enviada",
      description: "Se ha abierto WhatsApp con tu solicitud. Solo presiona enviar para completarla.",
    });

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

  const CartDropdown = () => (
    <PopoverContent className="w-80 p-4 bg-background border shadow-md z-50">
      <h3 className="font-semibold text-lg mb-3">Carrito de Compras</h3>
      {cartItems.length === 0 ? (
        <div className="text-center py-6">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Tu carrito está vacío</p>
          <p className="text-sm text-muted-foreground mt-1">
            Agrega productos desde nuestra sección de productos
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Lista de productos con scroll */}
          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.variant && `${item.variant} - `}Cantidad: {item.quantity}
                  </p>
                </div>
                {isAuthenticated && (
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                )}
              </div>
            ))}
          </div>
          
          {/* Total siempre visible */}
          <div className="border-t pt-3 mt-3 bg-background">
            {isAuthenticated && (
              <div className="flex justify-between items-center font-semibold mb-3">
                <span>Total:</span>
                <span>${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
            )}
            <Button 
              className="w-full mt-3 bg-primary hover:bg-primary-dark"
              onClick={isAuthenticated ? sendWhatsAppOrder : requestQuote}
            >
              {isAuthenticated ? "Enviar pedido por WhatsApp" : "Solicitar cotización"}
            </Button>
          </div>
        </div>
      )}
    </PopoverContent>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <img 
              src={logoAlNatural} 
              alt="Al Natural" 
              className="h-10 w-auto object-contain"
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
              <Popover open={showCartDropdown} onOpenChange={setShowCartDropdown}>
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
                <CartDropdown />
              </Popover>
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
              <Popover open={showCartDropdown} onOpenChange={setShowCartDropdown}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative mt-4 mx-2" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Carrito
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <CartDropdown />
              </Popover>
            </div>
          </div>
        )}
      </nav>
      
      <AccessCodeModal 
        isOpen={showAccessModal} 
        onClose={() => setShowAccessModal(false)} 
      />
    </header>
  );
};

export default Header;