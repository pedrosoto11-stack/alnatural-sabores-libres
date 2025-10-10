import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Leaf, Zap, Globe, Heart, Award, Users, Utensils } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Beneficios = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: mainRef, isVisible: mainVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: nutritionRef, isVisible: nutritionVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: lifestyleRef, isVisible: lifestyleVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const mainBenefits = [
    {
      icon: Shield,
      title: "100% Libres de Gluten",
      description: "Todos nuestros productos están certificados como libres de gluten, perfectos para personas con celiaquía o sensibilidad al gluten.",
      features: ["Certificación oficial", "Proceso controlado", "Sin contaminación cruzada", "Análisis periódicos"]
    },
    {
      icon: Leaf,
      title: "Ingredientes Naturales y Nutritivos",
      description: "Elaborados únicamente con plátano y yuca de primera calidad, sin aditivos artificiales ni conservantes.",
      features: ["Sin químicos artificiales", "Ricos en fibra", "Fuente de vitaminas", "Minerales esenciales"]
    },
    {
      icon: Zap,
      title: "Versátiles y Fáciles de Preparar",
      description: "Nuestros productos se adaptan a cualquier comida del día y son súper fáciles de preparar.",
      features: ["Preparación rápida", "Múltiples usos", "Para toda la familia", "Ahorro de tiempo"]
    },
    {
      icon: Globe,
      title: "Apoyamos lo Local y Sostenible",
      description: "Trabajamos directamente con productores locales venezolanos, promoviendo la economía nacional.",
      features: ["Productores locales", "Economía nacional", "Prácticas sostenibles", "Comercio justo"]
    }
  ];

  const nutritionalBenefits = [
    {
      icon: Heart,
      title: "Beneficios del Plátano",
      benefits: [
        "Rico en potasio para la salud cardiovascular",
        "Fuente natural de energía",
        "Contiene vitamina B6 y vitamina C",
        "Alto contenido de fibra dietética",
        "Antioxidantes naturales"
      ]
    },
    {
      icon: Award,
      title: "Beneficios de la Yuca",
      benefits: [
        "Excelente fuente de carbohidratos complejos",
        "Rica en vitamina C y folato",
        "Libre de grasas saturadas",
        "Aporta minerales como magnesio y zinc",
        "Fácil digestión"
      ]
    }
  ];

  const lifestyleBenefits = [
    {
      icon: Users,
      title: "Para Toda la Familia",
      description: "Productos seguros y nutritivos para niños, adultos y adultos mayores."
    },
    {
      icon: Utensils,
      title: "Versatilidad Culinaria",
      description: "Perfectos para desayunos, almuerzos, cenas y meriendas."
    },
    {
      icon: Shield,
      title: "Dietas Especiales",
      description: "Ideales para dietas sin gluten, veganas y de alimentación consciente."
    }
  ];

  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
            Beneficios Al Natural
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre todos los beneficios que nuestros productos ofrecen para tu salud, 
            tu estilo de vida y tu bienestar familiar.
          </p>
        </div>

        {/* Main Benefits */}
        <section ref={mainRef} className={`mb-20 transition-all duration-700 ${mainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Nuestros Pilares Fundamentales
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {mainBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 card-interactive hover:shadow-xl touch-scale"  style={{ animationDelay: `${index * 0.15}s` }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {benefit.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Nutritional Benefits */}
        <section ref={nutritionRef} className={`mb-20 transition-all duration-700 ${nutritionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Beneficios Nutricionales
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {nutritionalBenefits.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="p-6 card-interactive hover:shadow-lg touch-scale" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <Badge variant="outline" className="mt-0.5 text-xs bg-primary/5 text-primary border-primary/20">
                            ✓
                          </Badge>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Lifestyle Benefits */}
        <section ref={lifestyleRef} className={`mb-20 transition-all duration-700 ${lifestyleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Para Tu Estilo de Vida
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {lifestyleBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center p-6 card-interactive hover:shadow-xl touch-scale" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Health Impact */}
        <section>
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Impacto en Tu Salud
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Sin Gluten Certificado</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Aditivos Artificiales</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">+5</div>
                <div className="text-sm text-muted-foreground">Vitaminas y Minerales</div>
              </div>
            </div>
            <p className="mt-8 text-muted-foreground max-w-2xl mx-auto">
              Nuestros productos no solo alimentan tu cuerpo, sino que contribuyen 
              a un estilo de vida más saludable y consciente.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Beneficios;