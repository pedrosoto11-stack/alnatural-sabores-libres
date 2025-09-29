import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
const Clientes = () => {
  const testimonials = [{
    name: "María González",
    role: "Madre de familia",
    avatar: "MG",
    rating: 5,
    comment: "Desde que descubrí Al Natural, mi hija celíaca puede disfrutar de arepas como toda la familia. La calidad es excepcional y el sabor idéntico al tradicional.",
    city: "Caracas"
  }, {
    name: "Carlos Rodríguez",
    role: "Chef profesional",
    avatar: "CR",
    rating: 5,
    comment: "Como chef, puedo asegurar que los productos Al Natural mantienen la textura y sabor auténtico. Los uso en mi restaurante con excelentes resultados.",
    city: "Valencia"
  }, {
    name: "Ana Suárez",
    role: "Nutricionista",
    avatar: "AS",
    rating: 5,
    comment: "Recomiendo Al Natural a todos mis pacientes. Son productos nutritivos, sin gluten certificado y con ingredientes naturales de calidad.",
    city: "Maracaibo"
  }, {
    name: "Pedro Martínez",
    role: "Cliente frecuente",
    avatar: "PM",
    rating: 5,
    comment: "Los tequeños Al Natural son increíbles. Mis invitados nunca notan la diferencia con los tradicionales, pero yo sé que son más saludables.",
    city: "Barquisimeto"
  }, {
    name: "Lucía Herrera",
    role: "Deportista",
    avatar: "LH",
    rating: 5,
    comment: "Perfecto para mi dieta. Los patacones Al Natural me dan la energía que necesito antes del entrenamiento, sin sentirme pesada.",
    city: "Mérida"
  }, {
    name: "Roberto Díaz",
    role: "Padre de familia",
    avatar: "RD",
    rating: 5,
    comment: "Mis hijos aman las arepas Al Natural. Como padre, me tranquiliza saber que están comiendo algo natural y nutritivo todos los días.",
    city: "San Cristóbal"
  }];
  const partners = [{
    name: "Supermercados LM Market",
    logo: "LM",
    description: "Cadena líder en distribución de alimentos premium",
    coverage: "Nacional"
  }, {
    name: "Feria de hortalizas Tierra Santa",
    logo: "FTS",
    description: "Feria especializada en productos frescos y hortalizas",
    coverage: "Zona Central"
  }, {
    name: "Distribuidora la Granja",
    logo: "DLG",
    description: "Supermercados especializados en productos orgánicos",
    coverage: "Caracas y alrededores"
  }, {
    name: "Mérida Glutenfree",
    logo: "MG",
    description: "Mayorista especializado en productos sin gluten",
    coverage: "Región Andina"
  }, {
    name: "Super Éxito",
    logo: "SE",
    description: "Especialistas en alimentación saludable",
    coverage: "Tovar, Mérida"
  }, {
    name: "Distribuidora Sujer",
    logo: "DS",
    description: "Tienda gourmet y productos especiales",
    coverage: "Mérida"
  }];
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-current" : "text-muted-foreground"}`} />);
  };
  return <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Nuestros Clientes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            La satisfacción de nuestros clientes es nuestro mayor logro. Conoce las 
            experiencias de quienes ya forman parte de la familia Al Natural.
          </p>
        </div>

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-muted-foreground">
              Testimonios reales de personas que confían en Al Natural
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => <Card key={index} className="p-6 hover:shadow-lg transition-shadow relative">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>)}
          </div>
        </section>

        {/* Partners Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Algunos de Nuestros Aliados Comerciales</h2>
            <p className="text-lg text-muted-foreground">Trabajamos con los mejores distribuidores y puntos de venta del país</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {partner.logo}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-foreground mb-2">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {partner.description}
                    </p>
                    <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-xs font-medium text-primary">
                        {partner.coverage}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Al Natural en Números
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Puntos de Venta</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">Estados del País</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Valoración Promedio</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="text-center bg-muted/30 rounded-2xl p-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ¡Únete a la familia Al Natural!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Forma parte de nuestra comunidad de clientes satisfechos. Descubre el 
              sabor auténtico sin gluten que está conquistando Venezuela.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors">
                Hacer mi primer pedido
              </button>
              <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                Encontrar punto de venta
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>;
};
export default Clientes;