import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Users, ChefHat, X } from "lucide-react";
import { useState } from "react";
import arepasImg from "@/assets/arepa-reina-pepiada.png";
import tequenosImg from "@/assets/tequeños.jpg";
import fajitasImg from "@/assets/fajitas.jpg";
import pataconesImg from "@/assets/patacones.jpg";
import wrapFajitasImg from "@/assets/wrap-saludable-fajitas.png";

interface Recipe {
  id: string;
  title: string;
  description: string;
  time: string;
  serves: string;
  difficulty: "Fácil" | "Intermedio" | "Avanzado";
  image: string;
  ingredients: string[];
  steps: string[];
  tips?: string[];
}

const recipes: Recipe[] = [
  {
    id: "arepa-reina-pepiada",
    title: "Arepa Reina Pepiada Al Natural",
    description: "La clásica arepa venezolana con pollo y aguacate, ahora sin gluten",
    time: "20 min",
    serves: "4 personas",
    difficulty: "Fácil",
    image: arepasImg,
    ingredients: [
      "4 arepas Al Natural",
      "2 pechugas de pollo cocidas",
      "2 aguacates maduros",
      "1/4 taza de mayonesa",
      "Sal y pimienta al gusto",
      "Cilantro fresco picado"
    ],
    steps: [
      "Calentar las arepas Al Natural en un sartén o plancha hasta dorar ligeramente",
      "Desmechar el pollo cocido en trozos pequeños",
      "Triturar los aguacates y mezclar con el pollo",
      "Agregar mayonesa, sal, pimienta y cilantro",
      "Abrir las arepas por la mitad y rellenar generosamente",
      "Servir inmediatamente"
    ],
    tips: [
      "Las arepas Al Natural se calientan más rápido que las tradicionales",
      "Puedes agregar un toque de limón al relleno para más sabor"
    ]
  },
  {
    id: "wrap-fajita-saludable",
    title: "Wrap Saludable con Fajitas Al Natural",
    description: "Un wrap nutritivo y colorido perfecto para el almuerzo",
    time: "15 min",
    serves: "2 personas", 
    difficulty: "Fácil",
    image: wrapFajitasImg,
    ingredients: [
      "4 fajitas Al Natural",
      "1 pechuga de pollo a la plancha",
      "1/2 taza de lechuga picada",
      "1 tomate en rodajas",
      "1/4 de cebolla morada",
      "1/4 taza de queso rallado",
      "2 cucharadas de yogurt griego"
    ],
    steps: [
      "Calentar las fajitas Al Natural en un sartén seco por 30 segundos cada lado",
      "Cortar el pollo en tiras delgadas",
      "Colocar todos los ingredientes en el centro de cada fajita",
      "Doblar los extremos y enrollar firmemente",
      "Cortar por la mitad y servir"
    ],
    tips: [
      "Las fajitas Al Natural son más flexibles cuando están ligeramente tibias",
      "Puedes usar cualquier proteína de tu preferencia"
    ]
  },
  {
    id: "tequeños-al-horno",
    title: "Tequeños Al Natural al Horno",
    description: "Una versión más saludable de los tequeños tradicionales",
    time: "25 min",
    serves: "6 personas",
    difficulty: "Intermedio",
    image: tequenosImg,
    ingredients: [
      "1 paquete de tequeños Al Natural",
      "1 huevo batido para barnizar",
      "Aceite en spray",
      "Salsa de tu preferencia para acompañar"
    ],
    steps: [
      "Precalentar el horno a 200°C",
      "Colocar los tequeños en una bandeja con papel encerado",
      "Barnizar con huevo batido y rociar ligeramente con aceite",
      "Hornear por 15-20 minutos hasta dorar",
      "Voltear a la mitad del tiempo de cocción",
      "Servir calientes con tu salsa favorita"
    ],
    tips: [
      "No es necesario descongelar si están congelados",
      "Quedan más crujientes al horno que fritos"
    ]
  },
  {
    id: "patacones-gourmet",
    title: "Patacones Gourmet Al Natural",
    description: "Patacones elevados con toppings creativos",
    time: "30 min",
    serves: "4 personas",
    difficulty: "Intermedio",
    image: pataconesImg,
    ingredients: [
      "8 patacones Al Natural",
      "200g de camarones",
      "1 aguacate",
      "Queso fresco desmenuzado",
      "Salsa rosada",
      "Cilantro fresco",
      "Limón"
    ],
    steps: [
      "Dorar los patacones Al Natural en aceite caliente por 2-3 minutos cada lado",
      "Cocinar los camarones con ajo y limón",
      "Preparar el guacamole con el aguacate",
      "Colocar una base de guacamole en cada patacón",
      "Agregar los camarones, queso y cilantro",
      "Finalizar con salsa rosada y servir"
    ],
    tips: [
      "Los patacones Al Natural se doran uniformemente",
      "Puedes usar cualquier proteína marina"
    ]
  }
];

const Recetas = () => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);
  
  const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-primary/10 text-primary';
      case 'Intermedio': return 'bg-accent/10 text-accent-foreground';
      case 'Avanzado': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Recetas Al Natural
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre deliciosas formas de preparar nuestros productos. Desde recetas 
            tradicionales hasta creaciones innovadoras, ¡hay algo para cada ocasión!
          </p>
        </div>

        {/* Recipe Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge variant="secondary" className="px-4 py-2">Todas las recetas</Badge>
          <Badge variant="outline" className="px-4 py-2 border-primary text-primary">Desayunos</Badge>
          <Badge variant="outline" className="px-4 py-2 border-primary text-primary">Almuerzos</Badge>
          <Badge variant="outline" className="px-4 py-2 border-primary text-primary">Meriendas</Badge>
          <Badge variant="outline" className="px-4 py-2 border-primary text-primary">Aperitivos</Badge>
        </div>

        {/* Recipes Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden cursor-pointer" onClick={() => setSelectedImage({ src: recipe.image, title: recipe.title })}>
                <img 
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{recipe.title}</CardTitle>
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {recipe.description}
                </p>
                
                {/* Recipe Info */}
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{recipe.serves}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-4 w-4" />
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Ingredients */}
                <div>
                  <h4 className="font-semibold mb-3">Ingredientes:</h4>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="font-semibold mb-3">Preparación:</h4>
                  <ol className="space-y-2">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                {recipe.tips && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">💡 Tips del Chef:</h4>
                    <ul className="space-y-1">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="text-xs text-muted-foreground">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button className="w-full bg-primary hover:bg-primary-dark">
                  Ver receta completa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-primary/5 rounded-2xl p-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            ¿Tienes una receta especial?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nos encantaría conocer tus creaciones con productos Al Natural. 
            Comparte tu receta y podría aparecer en nuestra página.
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Compartir mi receta
          </Button>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedImage && (
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg shadow-lg max-h-[70vh] object-contain mx-auto"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Recetas;