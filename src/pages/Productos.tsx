import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";
import arepasImg from "@/assets/arepas.jpg";
import tequenosImg from "@/assets/tequeños.jpg";
import panesImg from "@/assets/panes.jpg";
import fajitasImg from "@/assets/fajitas.jpg";
import pataconesImg from "@/assets/patacones.jpg";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  image: string;
  variants?: string[];
}

const products: Product[] = [
  {
    id: "arepas",
    name: "Arepas Al Natural",
    category: "Arepas",
    description: "Nuestras arepas tradicionales venezolanas elaboradas 100% con harina de plátano. Perfectas para rellenar con tus ingredientes favoritos.",
    benefits: ["Sin gluten", "Rica en fibra", "Fuente de potasio", "Fácil digestión"],
    image: arepasImg,
    variants: ["Clásicas", "Con semillas", "Mini arepas"]
  },
  {
    id: "fajitas",
    name: "Fajitas de Plátano",
    category: "Fajitas", 
    description: "Deliciosas fajitas flexibles hechas con plátano verde, ideales para wraps saludables y creativos.",
    benefits: ["Muy versátiles", "Sin conservantes", "Textura suave", "Sabor neutro"],
    image: fajitasImg,
    variants: ["Pequeñas", "Grandes", "Extra finas"]
  },
  {
    id: "tequeños",
    name: "Tequeños Criollos",
    category: "Tequeños",
    description: "Los auténticos tequeños venezolanos con masa de yuca y plátano, listos para freír y disfrutar.",
    benefits: ["Tradicional venezolano", "Masa crujiente", "Sin gluten", "Perfecto aperitivo"],
    image: tequenosImg,
    variants: ["Con queso blanco", "Con queso amarillo", "Familiar"]
  },
  {
    id: "panes",
    name: "Panes Artesanales",
    category: "Panes",
    description: "Panes suaves y esponjosos elaborados con harinas de plátano y yuca, perfectos para el desayuno.",
    benefits: ["Textura esponjosa", "Sin levadura artificial", "Nutritivos", "Versátiles"],
    image: panesImg,
    variants: ["Pan de molde", "Panecillos", "Pan dulce"]
  },
  {
    id: "patacones",
    name: "Patacones Listos",
    category: "Patacones",
    description: "Patacones precocidos de plátano verde, listos para dorar y servir como acompañante perfecto.",
    benefits: ["Precocidos", "Ahorro de tiempo", "Textura perfecta", "Tradicional"],
    image: pataconesImg,
    variants: ["Redondos tradicionales", "Ovalados", "Mini patacones"]
  }
];

const Productos = () => {
  const [cart, setCart] = useState<{[key: string]: {product: Product, quantity: number, variant?: string}}>({});
  const { toast } = useToast();

  const addToCart = (product: Product, variant?: string) => {
    const key = `${product.id}-${variant || 'default'}`;
    setCart(prev => ({
      ...prev,
      [key]: {
        product,
        quantity: (prev[key]?.quantity || 0) + 1,
        variant
      }
    }));
    
    toast({
      title: "Producto agregado",
      description: `${product.name}${variant ? ` (${variant})` : ''} agregado a tu pedido`,
    });
  };

  const removeFromCart = (productId: string, variant?: string) => {
    const key = `${productId}-${variant || 'default'}`;
    setCart(prev => {
      const newCart = {...prev};
      if (newCart[key] && newCart[key].quantity > 1) {
        newCart[key].quantity -= 1;
      } else {
        delete newCart[key];
      }
      return newCart;
    });
  };

  const getCartQuantity = (productId: string, variant?: string) => {
    const key = `${productId}-${variant || 'default'}`;
    return cart[key]?.quantity || 0;
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Nuestros Productos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra línea completa de productos sin gluten, elaborados con 
            plátano y yuca de la mejor calidad.
          </p>
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <div className="mb-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Productos en tu pedido: {getTotalItems()}
              </span>
              <Button variant="default" className="bg-primary hover:bg-primary-dark">
                Finalizar pedido
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {product.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Beneficios:</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Variants */}
                {product.variants && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Presentaciones:</h4>
                    <div className="space-y-2">
                      {product.variants.map((variant) => {
                        const quantity = getCartQuantity(product.id, variant);
                        return (
                          <div key={variant} className="flex items-center justify-between p-2 rounded bg-muted/30">
                            <span className="text-sm">{variant}</span>
                            <div className="flex items-center space-x-2">
                              {quantity > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(product.id, variant)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                              {quantity > 0 && (
                                <span className="text-sm font-medium w-8 text-center">
                                  {quantity}
                                </span>
                              )}
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => addToCart(product, variant)}
                                className="h-8 w-8 p-0 bg-primary hover:bg-primary-dark"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add to cart for products without variants */}
                {!product.variants && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCartQuantity(product.id) > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                      {getCartQuantity(product.id) > 0 && (
                        <span className="font-medium">
                          {getCartQuantity(product.id)}
                        </span>
                      )}
                    </div>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="bg-primary hover:bg-primary-dark"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar al pedido
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-20 text-center bg-muted/30 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            ¿Necesitas más información?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Todos nuestros productos están certificados como libres de gluten y son 
            elaborados con los más altos estándares de calidad e higiene.
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Contactar asesor
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Productos;