import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "@/contexts/CartContext";
import { useAccessCode } from "@/contexts/AccessCodeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void;
}

export const CartDrawer = ({ open, onOpenChange, onCheckout }: CartDrawerProps) => {
  const { cartItems, addToCart, removeFromCart, getTotalItems } = useCart();
  const { isAuthenticated } = useAccessCode();
  const isMobile = useIsMobile();

  const TriggerButton = (
    <Button variant="ghost" size="sm" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {getTotalItems() > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {getTotalItems()}
        </span>
      )}
    </Button>
  );

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const CartContent = () => (
    <>
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="rounded-full bg-muted p-6 mb-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Tu carrito está vacío</h3>
          <p className="text-sm text-muted-foreground text-center">
            Agrega productos desde nuestra sección de productos
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 -mx-4 px-4 mb-4">
            <div className="space-y-3 pb-2">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.variant}-${index}`} className="flex gap-3 p-3 rounded-lg border bg-card animate-fade-in hover-lift transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight mb-1 truncate">{item.name}</h4>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mb-2">{item.variant}</p>
                    )}
                    {isAuthenticated && (
                      <p className="text-sm font-semibold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => {
                        for (let i = 0; i < item.quantity; i++) {
                          removeFromCart(item.id, item.variant);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 transition-all hover:scale-105"
                        onClick={() => removeFromCart(item.id, item.variant)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2ch] text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 transition-all hover:scale-105"
                        onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, variant: item.variant })}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-auto pt-3 border-t">
            {isAuthenticated && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
              onClick={() => {
                onCheckout();
                onOpenChange(false);
              }}
            >
              {isAuthenticated ? "Enviar pedido por WhatsApp" : "Solicitar cotización"}
            </Button>
          </div>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left pb-4">
            <DrawerTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="h-5 w-5" />
              Carrito de Compras
            </DrawerTitle>
            <DrawerDescription>
              {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'} en tu carrito
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 flex-1 overflow-hidden">
            <CartContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Carrito de Compras</h3>
          </div>
          <div className="max-h-[60vh]">
            <CartContent />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
