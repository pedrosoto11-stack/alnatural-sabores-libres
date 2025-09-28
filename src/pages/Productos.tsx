import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { AccessCodeModal } from "@/components/AccessCodeModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Minus, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import arepasImg from "@/assets/arepas.jpg";
import tequenosImg from "@/assets/tequeños.jpg";
import tequenosYucaImg from "@/assets/tequenos-yuca.png";
import tequenosPlátanoVerdeImg from "@/assets/tequenos-platano-verde.png";
import tequenosPlátanoAmarilloImg from "@/assets/tequenos-platano-amarillo.png";
import tequenosCombinadoImg from "@/assets/tequenos-combinado.png";
import panesImg from "@/assets/panes.jpg";
import panes12UnidadesImg from "@/assets/panes-12-unidades.png";
import panes4UnidadesImg from "@/assets/panes-4-unidades.png";
import fajitasImg from "@/assets/fajitas.jpg";
import fajitaYucaImg from "@/assets/fajita-yuca.png";
import fajitaYucaPimentonImg from "@/assets/fajita-yuca-pimenton.png";
import fajitaYucaZanahoriaImg from "@/assets/fajita-yuca-zanahoria.png";
import fajitaYucaAcelgaEspinacaImg from "@/assets/fajita-yuca-acelga-espinaca.png";
import fajitaYucaOreganoImg from "@/assets/fajita-yuca-oregano.png";
import fajitaPlátanoAmarilloImg from "@/assets/fajita-platano-amarillo.png";
import fajitaPlátanoVerdeImg from "@/assets/fajita-platano-verde.png";
import fajitaCamburVerdeImg from "@/assets/fajita-cambur-verde.png";
import pataconesImg from "@/assets/patacones.png";
import arepaPlátanoVerdeImg from "@/assets/arepa-platano-verde.png";
import arepaPlátanoVerdeAjoPeejilImg from "@/assets/arepa-platano-verde-ajo-perejil.png";
import arepaPlátanoAmarilloImg from "@/assets/arepa-platano-amarillo.png";
import arepaYucaImg from "@/assets/arepa-yuca.png";
import arepaYucaMixtaImg from "@/assets/arepa-yuca-mixta.png";
import arepaCamburVerdeImg from "@/assets/arepa-cambur-verde.png";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  is_active: boolean;
}

// Mapeo de imágenes por nombre de producto
const productImages: { [key: string]: string } = {
  "Fajita de Yuca": fajitaYucaImg,
  "Fajita de Yuca con Pimentón": fajitaYucaPimentonImg,
  "Fajita de Yuca con Zanahoria": fajitaYucaZanahoriaImg,
  "Fajita de Yuca con Acelga y Espinacas": fajitaYucaAcelgaEspinacaImg,
  "Fajita de Yuca con Orégano": fajitaYucaOreganoImg,
  "Fajita de Plátano Amarillo": fajitaPlátanoAmarilloImg,
  "Fajita de Plátano Verde": fajitaPlátanoVerdeImg,
  "Fajita de Cambur Verde": fajitaCamburVerdeImg,
  "Tequeños de Yuca con Queso": tequenosYucaImg,
  "Tequeños de Plátano Verde con Queso": tequenosPlátanoVerdeImg,
  "Tequeños de Plátano Amarillo con Queso": tequenosPlátanoAmarilloImg,
  "Tequeños Combinados (Yuca + Plátano) con Queso": tequenosCombinadoImg,
  "Panes de Yuca con Queso - 12 unidades": panes12UnidadesImg,
  "Panes de Yuca con Queso - 4 unidades": panes4UnidadesImg,
  "Patacones de Plátano Verde": pataconesImg,
  "Arepa de Plátano Verde": arepaPlátanoVerdeImg,
  "Arepa de Plátano Verde con Ajo y Perejil": arepaPlátanoVerdeAjoPeejilImg,
  "Arepa de Plátano Amarillo": arepaPlátanoAmarilloImg,
  "Arepa de Yuca": arepaYucaImg,
  "Arepa Mixta de Yuca (6 Sabores)": arepaYucaMixtaImg,
  "Arepa de Cambur Verde": arepaCamburVerdeImg,
};

// Mapeo de beneficios por categoría
const categoryBenefits: { [key: string]: string[] } = {
  "Fajitas": ["Sin gluten", "Empacadas al vacío", "Versátiles para recetas dulces o saladas", "100% naturales"],
  "Tequeños": ["Libres de gluten", "Empacados al vacío", "Snack delicioso y versátil", "Fáciles de preparar"],
  "Panes": ["100% libres de gluten", "Empacados al vacío", "Preparación fácil: hornear 30 min a 180°C", "Hechos con yuca y almidón"],
  "Patacones": ["100% libres de gluten", "Empacados al vacío", "Versátiles: acompañante, base o snack", "Elaborados con plátano verde fresco"],
  "Arepas": ["100% naturales", "Libres de gluten", "Empacadas al vacío", "Fáciles de preparar"]
};

const Productos = () => {
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, getCartQuantity, getTotalItems, setShowCartDropdown } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive"
        });
        return;
      }

      setProducts(products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setShowAccessModal(true);
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price
    });
    toast({
      title: "Producto agregado",
      description: `${product.name} agregado a tu pedido`
    });
  };

  const handleFinalizarPedido = () => {
    setShowCartDropdown(true);
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
            Descubre nuestra línea completa de productos sin gluten, elaborados con plátano, yuca y cambur verde de la mejor calidad.
          </p>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">
                  Acceso para Distribuidores
                </h3>
                <p className="text-amber-700 text-sm mb-3">
                  Para ver precios y realizar pedidos necesitas un código de acceso. Los consumidores pueden explorar nuestros productos y solicitar información.
                </p>
                <Button 
                  size="sm" 
                  onClick={() => setShowAccessModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Ingresar código de acceso
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <div className="mb-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Productos en tu pedido: {getTotalItems()}
              </span>
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary-dark"
                onClick={handleFinalizarPedido}
              >
                {isAuthenticated ? "Finalizar pedido" : "Solicitar cotización"}
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando productos...</span>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => {
              const productImage = productImages[product.name] || product.image_url;
              const benefits = categoryBenefits[product.category] || [];
              const quantity = getCartQuantity(product.id);
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden cursor-pointer">
                    <img 
                      src={productImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      onClick={() => setSelectedImage({src: productImage, alt: product.name})}
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
                        {benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price - Only for authenticated users */}
                    {isAuthenticated && (
                      <div className="mb-3">
                        <span className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">por paquete</span>
                      </div>
                    )}

                    {/* Add to Cart */}
                    <div className="flex items-center justify-between">
                      {isAuthenticated ? (
                        <div className="flex items-center space-x-2 w-full">
                          {quantity > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => removeFromCart(product.id)} 
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
                            onClick={() => handleAddToCart(product)} 
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full" onClick={() => setShowAccessModal(true)}>
                          Solicitar cotización
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Products Found */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron productos disponibles.</p>
          </div>
        )}

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                className="w-full h-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Access Code Modal */}
        <AccessCodeModal 
          isOpen={showAccessModal} 
          onClose={() => setShowAccessModal(false)} 
        />
      </div>
    </main>
  );
};

export default Productos;