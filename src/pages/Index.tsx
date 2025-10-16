import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { Leaf, Heart, Shield, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import heroProducts from "@/assets/equipo-3.png";

const Index = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.15 });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 });

  return <main>
      {/* Hero Section */}
      <section 
        ref={heroAnimation.ref}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20"
      >
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              className={`text-center lg:text-left space-y-6 transition-all duration-700 ${
                heroAnimation.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                <span className="text-primary text-7xl inline-block animate-fade-in">Del campo</span><br />
                <span className="text-8xl inline-block animate-fade-in-up">a tu mesa</span>
              </h1>
              <p className={`text-xl lg:text-2xl text-muted-foreground font-medium transition-all duration-700 delay-200 ${
                heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}>
                Sabores naturales sin gluten
              </p>
              <p className={`text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-300 ${
                heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}>
                Hecho con plátano, yuca y cambur verde, pensado para ti. Descubre el sabor auténtico de Venezuela en cada bocado.
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-500 ${
                heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}>
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-lg px-8 py-6 touch-scale btn-press" asChild>
                  <NavLink to="/productos">Ver productos</NavLink>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10 touch-scale btn-press" asChild>
                  <NavLink to="/contacto">Haz tu pedido</NavLink>
                </Button>
              </div>
            </div>
            <div className={`relative transition-all duration-700 delay-300 ${
              heroAnimation.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}>
              <img 
                src={heroProducts} 
                alt="Equipo Al Natural - Productores de alimentos sin gluten" 
                className="w-full h-auto rounded-2xl shadow-2xl hover-lift" 
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-full p-6 shadow-lg animate-bounce-subtle hover-glow">
                <Leaf className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section 
        ref={featuresAnimation.ref}
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${
            featuresAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir Al Natural?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprometidos con tu bienestar y el sabor auténtico de nuestra tierra venezolana.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Sin Gluten",
                description: "Productos completamente libres de gluten, seguros para celíacos.",
                delay: "delay-100"
              },
              {
                icon: Leaf,
                title: "Ingredientes Naturales",
                description: "Solo plátano y yuca de la mejor calidad, sin aditivos artificiales.",
                delay: "delay-200"
              },
              {
                icon: Heart,
                title: "Nutritivos",
                description: "Ricos en fibra, vitaminas y minerales para una alimentación saludable.",
                delay: "delay-300"
              },
              {
                icon: Star,
                title: "Sabor Auténtico",
                description: "El verdadero sabor venezolano que llevas en el corazón.",
                delay: "delay-500"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className={`text-center p-6 bg-card card-interactive touch-scale transition-all duration-700 ${feature.delay} ${
                  featuresAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center hover-glow transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        ref={ctaAnimation.ref}
        className="py-20 bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl lg:text-4xl font-bold mb-6 transition-all duration-700 ${
            ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            ¿Listo para probar Al Natural?
          </h2>
          <p className={`text-lg mb-8 opacity-90 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            ctaAnimation.isVisible ? "opacity-90 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            Descubre todos nuestros productos y comienza a comercializarlos hoy mismo. 
            ¡Te llevamos el sabor natural directo a tu hogar o negocio!
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
            ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 touch-scale btn-press hover-lift" asChild>
              <NavLink to="/productos">Explorar productos</NavLink>
            </Button>
          </div>
        </div>
      </section>
    </main>;
};
export default Index;