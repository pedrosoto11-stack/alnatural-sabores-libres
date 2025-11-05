import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAccessCode } from "@/contexts/AccessCodeContext";
import { useAdmin } from "@/contexts/AdminContext";
import { AccessCodeModal } from "@/components/AccessCodeModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Lock, Pencil, Save, X, Loader2 } from "lucide-react";
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
  benefits: string[];
  image: string;
  variants?: string[];
}
const products: Product[] = [
// FAJITAS - 8 productos
{
  id: "fajita-yuca",
  name: "Fajita de Yuca",
  category: "Fajitas",
  description: "Fajita libre de gluten hecha 100% con yuca fresca. Su sabor neutro las hace perfectas para wraps, tacos y pizzas saludables. 6 unidades de 65g empacadas al vacío.",
  benefits: ["Hechas solo con yuca fresca", "Sin gluten", "Empacadas al vacío", "Versátiles para recetas dulces o saladas"],
  image: fajitaYucaImg
}, {
  id: "fajita-yuca-pimenton",
  name: "Fajita de Yuca con Pimentón",
  category: "Fajitas",
  description: "Fajitas de yuca con el sabor y color natural del pimentón, logrando una opción atractiva, sabrosa y nutritiva. 6 unidades de 65g empacadas al vacío.",
  benefits: ["Yuca + pimentón natural", "Sin gluten", "Color y sabor atractivo", "Empacadas al vacío"],
  image: fajitaYucaPimentonImg
}, {
  id: "fajita-yuca-zanahoria",
  name: "Fajita de Yuca con Zanahoria",
  category: "Fajitas",
  description: "Fajitas de yuca con el aporte nutritivo de la zanahoria. Rica en betacarotenos y fibra, con un color vibrante y sabor suave. 6 unidades de 65g empacadas al vacío.",
  benefits: ["Yuca + zanahoria fresca", "Fuente de fibra y antioxidantes", "Sin gluten", "Rica en betacarotenos"],
  image: fajitaYucaZanahoriaImg
}, {
  id: "fajita-yuca-acelga-espinaca",
  name: "Fajita de Yuca con Acelga y Espinacas",
  category: "Fajitas",
  description: "Fajitas de yuca con el poder verde de la acelga y espinaca. Rica en hierro, fibra y antioxidantes naturales. 6 unidades de 65g empacadas al vacío.",
  benefits: ["Yuca + acelga + espinaca", "Fuente natural de hierro y fibra", "Sin gluten", "Sin aditivos"],
  image: fajitaYucaAcelgaEspinacaImg
}, {
  id: "fajita-yuca-oregano",
  name: "Fajita de Yuca con Orégano",
  category: "Fajitas",
  description: "Fajitas de yuca aromatizadas con orégano natural. El sabor fresco y herbal potencia la yuca. 6 unidades de 65g empacadas al vacío.",
  benefits: ["Yuca + orégano natural", "Sabor único", "Sin aditivos", "Apta para celíacos"],
  image: fajitaYucaOreganoImg
}, {
  id: "fajita-platano-amarillo",
  name: "Fajita de Plátano Amarillo",
  category: "Fajitas",
  description: "Fajita naturalmente dulce, elaborada con plátano maduro amarillo. Perfecta para recetas dulces y postres saludables. 6 unidades de 65g empacadas al vacío.",
  benefits: ["100% plátano amarillo", "Naturalmente dulce", "Sin gluten", "Ideal para postres"],
  image: fajitaPlátanoAmarilloImg
}, {
  id: "fajita-platano-verde",
  name: "Fajita de Plátano Verde",
  category: "Fajitas",
  description: "Fajita elaborada con plátano verde fresco, con textura firme y sabor neutro. Ideal para wraps salados. 6 unidades de 65g empacadas al vacío.",
  benefits: ["100% plátano verde", "Textura firme", "Sabor neutro", "Sin gluten"],
  image: fajitaPlátanoVerdeImg
}, {
  id: "fajita-cambur-verde",
  name: "Fajita de Cambur Verde",
  category: "Fajitas",
  description: "Fajita saludable hecha con cambur verde. Una opción innovadora, con un sabor suave y gran aporte de energía. 6 unidades de 65g empacadas al vacío.",
  benefits: ["Hechas con cambur verde", "Fuente de potasio y fibra", "Sin gluten", "Aporte energético"],
  image: fajitaCamburVerdeImg
},
// TEQUEÑOS - 4 productos
{
  id: "tequenos-yuca-queso",
  name: "Tequeños de Yuca con Queso",
  category: "Tequeños",
  description: "El clásico venezolano con masa 100% yuca y queso fresco, libre de gluten. Crujientes por fuera y suaves por dentro. 10 unidades de 60g empacadas al vacío.",
  benefits: ["Masa 100% yuca fresca", "Relleno de queso fresco", "Libres de gluten", "Empacados al vacío"],
  image: tequenosYucaImg
}, {
  id: "tequenos-platano-verde-queso",
  name: "Tequeños de Plátano Verde con Queso",
  category: "Tequeños",
  description: "Tequeños elaborados con masa de plátano verde y rellenos de queso fresco, 100% libres de gluten. 10 unidades de 60g empacadas al vacío.",
  benefits: ["Masa 100% plátano verde", "Libres de gluten", "Snack versátil", "Fáciles de preparar"],
  image: tequenosPlátanoVerdeImg
}, {
  id: "tequenos-platano-amarillo-queso",
  name: "Tequeños de Plátano Amarillo con Queso",
  category: "Tequeños",
  description: "El tequeño más sabroso: masa de plátano maduro amarillo y queso fresco. Versión naturalmente dulce del snack venezolano. 10 unidades de 60g empacadas al vacío.",
  benefits: ["Masa de plátano maduro amarillo", "Toque naturalmente dulce", "Sin gluten", "Empacados al vacío"],
  image: tequenosPlátanoAmarilloImg
}, {
  id: "tequenos-combinados-queso",
  name: "Tequeños Combinados (Yuca + Plátano) con Queso",
  category: "Tequeños",
  description: "Masa mixta de yuca y plátano, rellena de queso fresco: un tequeño único y sin gluten. Una propuesta innovadora. 10 unidades de 60g empacadas al vacío.",
  benefits: ["Masa combinada de yuca + plátano", "Relleno de queso fresco venezolano", "Libres de gluten", "Snack delicioso y versátil"],
  image: tequenosCombinadoImg
},
// PANES - 2 productos (las dos presentaciones)
{
  id: "panes-yuca-queso-12",
  name: "Panes de Yuca con Queso - 12 unidades",
  category: "Panes",
  description: "Deliciosos pancitos elaborados con masa de yuca, queso fresco y almidón. 100% libres de gluten, congelados y listos para hornear. Paquete de 12 unidades (600g).",
  benefits: ["Hechos con yuca y almidón", "100% libres de gluten", "Empacados al vacío", "Preparación fácil: hornear 30 min a 180°C"],
  image: panes12UnidadesImg
}, {
  id: "panes-yuca-queso-4",
  name: "Panes de Yuca con Queso - 4 unidades",
  category: "Panes",
  description: "Deliciosos pancitos elaborados con masa de yuca, queso fresco y almidón. 100% libres de gluten, congelados y listos para hornear. Paquete de 4 unidades (200g).",
  benefits: ["Hechos con yuca y almidón", "100% libres de gluten", "Empacados al vacío", "Preparación fácil: hornear 30 min a 180°C"],
  image: panes4UnidadesImg
},
// PATACONES - 1 producto
{
  id: "patacones-platano-verde",
  name: "Patacones de Plátano Verde",
  category: "Patacones",
  description: "Rodajas de plátano verde prensadas, congeladas y empacadas al vacío, listas para freír. Ideales como acompañantes o bases para rellenos. 10 unidades de 60g.",
  benefits: ["Elaborados con plátano verde fresco", "100% libres de gluten", "Empacados al vacío", "Versátiles: acompañante, base o snack"],
  image: pataconesImg
},
// AREPAS - 6 productos
{
  id: "arepa-platano-verde",
  name: "Arepa de Plátano Verde",
  category: "Arepas",
  description: "La auténtica arepa venezolana elaborada con plátano verde. Nutritiva, de sabor suave y totalmente libre de gluten. 6 unidades de 140g empacadas al vacío.",
  benefits: ["100% naturales, hechas con plátano verde", "Libres de gluten", "Empacadas al vacío", "Fáciles de preparar"],
  image: arepaPlátanoVerdeImg
}, {
  id: "arepa-platano-verde-ajo-perejil",
  name: "Arepa de Plátano Verde con Ajo y Perejil",
  category: "Arepas",
  description: "Arepas elaboradas con plátano verde fresco, ajo y perejil natural. Combina el sabor neutro del plátano con el aroma fresco del perejil. 6 unidades de 140g empacadas al vacío.",
  benefits: ["Elaboradas con plátano verde fresco", "Sazonadas con ajo y perejil natural", "Libres de gluten", "Ideales para rellenos salados"],
  image: arepaPlátanoVerdeAjoPeejilImg
}, {
  id: "arepa-platano-amarillo",
  name: "Arepa de Plátano Amarillo",
  category: "Arepas",
  description: "Arepa dulce y nutritiva hecha con plátano maduro amarillo, 100% libre de gluten. Sabor naturalmente dulce y textura suave. 6 unidades de 140g empacadas al vacío.",
  benefits: ["Hechas con plátano amarillo maduro", "Sabor naturalmente dulce", "Sin gluten", "Empacadas al vacío"],
  image: arepaPlátanoAmarilloImg
}, {
  id: "arepa-yuca",
  name: "Arepa de Yuca",
  category: "Arepas",
  description: "Arepa tradicional venezolana hecha con masa de yuca fresca. Textura suave, sabor neutro y 100% libre de gluten. 6 unidades de 140g empacadas al vacío.",
  benefits: ["Hechas con yuca fresca", "Sin gluten", "Empacadas al vacío", "Versátiles para recetas dulces y saladas"],
  image: arepaYucaImg
}, {
  id: "arepa-yuca-mixta-6-sabores",
  name: "Arepa Mixta de Yuca (6 Sabores)",
  category: "Arepas",
  description: "Una experiencia única: 6 arepas de yuca con diferentes sabores (remolacha, pimentón, zanahoria, acelgas y espinacas, semillas de chía y ajonjolí, orégano). 6 unidades de 140g empacadas al vacío.",
  benefits: ["Sin gluten y aptas para celíacos", "Empacadas al vacío", "Opción variada y nutritiva", "Colores y sabores naturales"],
  image: arepaYucaMixtaImg
}, {
  id: "arepa-cambur-verde",
  name: "Arepa de Cambur Verde",
  category: "Arepas",
  description: "Arepas elaboradas con cambur verde, una alternativa natural, nutritiva y libre de gluten. Sabor suave, ligeramente menos dulce que el plátano. 6 unidades de 140g empacadas al vacío.",
  benefits: ["Elaboradas con cambur verde fresco", "Libres de gluten", "Empacadas al vacío", "Sabor diferente, nutritivo y versátil"],
  image: arepaCamburVerdeImg
}];

// Mapeo de IDs de producto string a UUIDs de la base de datos
const PRODUCT_ID_MAP: Record<string, string> = {
  // FAJITAS
  "fajita-yuca": "37dad07f-a242-4d94-917d-d8c0203fdcfa",
  "fajita-yuca-pimenton": "b1a0ab03-9792-432a-9db4-ba04e1081cc1",
  "fajita-yuca-zanahoria": "0bc55979-9ac5-459f-8299-f37a57f66724",
  "fajita-yuca-acelga-espinaca": "b8bf85c5-dcda-466c-b162-408ff25e5a08",
  "fajita-yuca-oregano": "684b2c67-dcde-41a1-b4c4-9dbb2d421067",
  "fajita-platano-amarillo": "6221cd34-2d72-459d-a45c-cdad5536e277",
  "fajita-platano-verde": "b8f65471-f41d-406f-83c2-378ebd4d2ff0",
  "fajita-cambur-verde": "b77b96e6-3dc5-44f9-a25d-119a4911a814",
  
  // TEQUEÑOS
  "tequenos-yuca-queso": "e290c4a9-cecc-4bcd-bd17-eeb6345780c2",
  "tequenos-platano-verde-queso": "8ef692f8-edc5-4bc1-ae98-6a014fc073af",
  "tequenos-platano-amarillo-queso": "ed69f3fa-7a47-4822-81fa-b48596925ae4",
  "tequenos-combinados-queso": "170f6455-3ba1-4472-9043-e8547aa78395",
  
  // PANES
  "panes-yuca-queso-4": "7bbac9c6-74c2-4c5e-b02c-772cbd6b3f2c",
  "panes-yuca-queso-12": "e1a91fcc-0f36-4018-8bf9-2e42757eff62",
  
  // PATACONES
  "patacones-platano-verde": "234b7735-689f-4e91-b52d-681cbea947c6",
  
  // AREPAS
  "arepa-platano-verde": "73d8a386-a327-4809-82ee-79f69e8d1157",
  "arepa-platano-verde-ajo-perejil": "9cf19f05-8846-44d1-8169-2c9826ad2286",
  "arepa-platano-amarillo": "5ddfd0fe-de90-44b5-a2ce-8b660166890e",
  "arepa-yuca": "36516820-5e05-4b10-8164-aa2225daddd6",
  "arepa-yuca-mixta-6-sabores": "da9c6ec0-c122-4aa2-8861-de7845d4ddfe",
  "arepa-cambur-verde": "ada7c81d-f39e-4145-984b-b021fff59373",
};


const Productos = () => {
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const { addToCart, removeFromCart, getCartQuantity, getTotalItems, setShowCartDropdown } = useCart();
  const { isAuthenticated } = useAccessCode();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  // Cargar precios desde la base de datos
  useEffect(() => {
    const fetchProductPrices = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price')
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching prices:', error);
          return;
        }

        if (data) {
          const pricesMap: Record<string, number> = {};
          data.forEach(product => {
            pricesMap[product.id] = product.price;
          });
          setProductPrices(pricesMap);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchProductPrices();
  }, []);

  // Función para obtener el precio de un producto usando el mapeo de IDs
  const getProductPrice = (productId: string): number => {
    const dbId = PRODUCT_ID_MAP[productId];
    return productPrices[dbId] || 0;
  };

  const startEditingPrice = (productId: string) => {
    const currentPrice = getProductPrice(productId);
    setEditingProductId(productId);
    setEditingPrice(currentPrice.toString());
  };

  const cancelEditingPrice = () => {
    setEditingProductId(null);
    setEditingPrice("");
  };

  const updateProductPrice = async (productId: string) => {
    const newPrice = parseFloat(editingPrice);
    
    if (isNaN(newPrice) || newPrice < 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un precio válido",
        variant: "destructive"
      });
      return;
    }

    const dbId = PRODUCT_ID_MAP[productId];
    if (!dbId) {
      toast({
        title: "Error",
        description: "Este producto no está configurado en la base de datos",
        variant: "destructive"
      });
      return;
    }

    setIsSavingPrice(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ price: newPrice })
        .eq('id', dbId);

      if (error) {
        console.error('Error updating price:', error);
        toast({
          title: "Error",
          description: "Error al actualizar el precio",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setProductPrices(prev => ({
        ...prev,
        [dbId]: newPrice
      }));

      toast({
        title: "Precio actualizado",
        description: "El precio se ha actualizado exitosamente"
      });
      
      setEditingProductId(null);
      setEditingPrice("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el precio",
        variant: "destructive"
      });
    } finally {
      setIsSavingPrice(false);
    }
  };

  const handleAddToCart = (product: Product, variant?: string) => {
    if (!isAuthenticated) {
      setShowAccessModal(true);
      return;
    }
    
    // Usar el ID único del producto directamente
    addToCart({
      id: product.id,
      name: product.name,
      price: getProductPrice(product.id),
      variant
    });
    toast({
      title: "Producto agregado",
      description: `${product.name}${variant ? ` (${variant})` : ''} agregado a tu pedido`
    });
  };

  const handleFinalizarPedido = () => {
    setShowCartDropdown(true);
  };
  return <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Nuestros Productos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Descubre nuestra línea completa de productos sin gluten, elaborados con plátano, yuca y cambur verde de la mejor calidad.</p>
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden cursor-pointer">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  onClick={() => setSelectedImage({src: product.image, alt: product.name})}
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
                    {product.benefits.map((benefit, index) => <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>)}
                  </div>
                </div>


                {/* Variants */}
                {product.variants && <div className="space-y-2">
                    <h4 className="font-medium text-sm">Presentaciones:</h4>
                    <div className="space-y-2">
                      {product.variants.map(variant => {
                  const quantity = getCartQuantity(product.id, variant);
                  return <div key={variant} className="flex items-center justify-between p-2 rounded bg-muted/30">
                            <div className="flex-1">
                              <span className="text-sm">{variant}</span>
                              {isAuthenticated && (
                                <div className="flex items-center gap-2 mt-1">
                                  {isAdmin && editingProductId === product.id ? (
                                    <>
                                      <span className="text-xs">$</span>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingPrice}
                                        onChange={(e) => setEditingPrice(e.target.value)}
                                        className="h-6 w-20 text-xs"
                                        disabled={isSavingPrice}
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() => updateProductPrice(product.id)}
                                        disabled={isSavingPrice}
                                        className="h-6 w-6 p-0"
                                      >
                                        {isSavingPrice ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Save className="h-3 w-3" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={cancelEditingPrice}
                                        disabled={isSavingPrice}
                                        className="h-6 w-6 p-0"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-xs text-muted-foreground">${getProductPrice(product.id)}</div>
                                      {isAdmin && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => startEditingPrice(product.id)}
                                          className="h-6 w-6 p-0"
                                        >
                                          <Pencil className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            {isAuthenticated ? (
                              <div className="flex items-center border rounded-lg bg-background">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => removeFromCart(product.id, variant)}
                                  disabled={quantity === 0}
                                  className="h-8 w-8 p-0 hover:bg-muted"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium w-10 text-center">
                                  {quantity}
                                </span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleAddToCart(product, variant)}
                                  className="h-8 w-8 p-0 hover:bg-muted"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleAddToCart(product, variant)} 
                                className="h-8 text-xs px-2"
                              >
                                Cotizar
                              </Button>
                            )}
                          </div>;
                })}
                    </div>
                  </div>}

                {/* Add to cart for products without variants */}
                {!product.variants && (
                  <div className="space-y-3">
                    {/* Show price only when authenticated */}
                    {isAuthenticated && (
                      <div className="flex items-center gap-2">
                        {isAdmin && editingProductId === product.id ? (
                          <>
                            <span className="text-lg font-bold">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editingPrice}
                              onChange={(e) => setEditingPrice(e.target.value)}
                              className="h-9 w-28"
                              disabled={isSavingPrice}
                            />
                            <Button
                              size="sm"
                              onClick={() => updateProductPrice(product.id)}
                              disabled={isSavingPrice}
                            >
                              {isSavingPrice ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEditingPrice}
                              disabled={isSavingPrice}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-lg font-bold text-primary">${getProductPrice(product.id)}</span>
                            <span className="text-sm text-muted-foreground">por paquete</span>
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditingPrice(product.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {isAuthenticated ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg bg-background">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              const quantity = getCartQuantity(product.id);
                              if (quantity > 0) {
                                removeFromCart(product.id);
                              }
                            }}
                            disabled={getCartQuantity(product.id) === 0}
                            className="h-10 w-10 p-0 hover:bg-muted disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-12 text-center">
                            {getCartQuantity(product.id)}
                          </span>
                        </div>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar al pedido
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleAddToCart(product)} 
                        variant="outline"
                        className="w-full"
                      >
                        Solicitar cotización
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>)}
        </div>

        {/* Cart Summary - Bottom */}
        {getTotalItems() > 0 && (
          <div className="mt-12 mb-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
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

        {/* Info Section */}
        <div className="mt-8 text-center bg-muted/30 rounded-2xl p-12">
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

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          {selectedImage && (
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AccessCodeModal 
        isOpen={showAccessModal} 
        onClose={() => setShowAccessModal(false)} 
      />
    </main>;
};
export default Productos;