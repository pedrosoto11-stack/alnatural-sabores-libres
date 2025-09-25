import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { Leaf, Heart, Shield, Star } from "lucide-react";
import heroProducts from "@/assets/hero-products.jpg";
const Index = () => {
  return <main>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                <span className="text-primary">Del campo</span><br />
                <span>a tu mesa</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                Sabores naturales sin gluten
              </p>
              <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">Hecho con plátano, yuca y cambur verde, pensado para ti. Descubre el sabor auténtico de Venezuela en cada bocado.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-lg px-8 py-6" asChild>
                  <NavLink to="/productos">Ver productos</NavLink>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10" asChild>
                  <NavLink to="/contacto">Haz tu pedido</NavLink>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img src={heroProducts} alt="Productos Al Natural - Arepas, tequeños y panes sin gluten" className="w-full h-auto rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-full p-6 shadow-lg">
                <Leaf className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir Al Natural?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprometidos con tu bienestar y el sabor auténtico de nuestra tierra venezolana.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">100% Sin Gluten</h3>
                <p className="text-muted-foreground text-sm">
                  Productos completamente libres de gluten, seguros para celíacos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Ingredientes Naturales</h3>
                <p className="text-muted-foreground text-sm">
                  Solo plátano y yuca de la mejor calidad, sin aditivos artificiales.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Nutritivos</h3>
                <p className="text-muted-foreground text-sm">
                  Ricos en fibra, vitaminas y minerales para una alimentación saludable.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Sabor Auténtico</h3>
                <p className="text-muted-foreground text-sm">
                  El verdadero sabor venezolano que llevas en el corazón.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            ¿Listo para probar Al Natural?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Descubre todos nuestros productos y haz tu pedido hoy mismo. ¡Te llevamos el sabor natural directo a tu hogar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <NavLink to="/productos">Explorar productos</NavLink>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <NavLink to="/contacto">Contactar ahora</NavLink>
            </Button>
          </div>
        </div>
      </section>
    </main>;
};
export default Index;