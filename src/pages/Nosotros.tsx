import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Heart, Users, Award } from "lucide-react";
const Nosotros = () => {
  return <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sobre Al Natural
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos una empresa venezolana comprometida con ofrecer productos alimenticios 
            de la más alta calidad, libres de gluten y elaborados con ingredientes naturales.
          </p>
        </div>

        {/* Historia */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Nuestra Historia</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Al Natural nació del sueño de llevar a cada hogar venezolano productos 
                  que honren nuestras tradiciones culinarias, pero adaptados a las necesidades 
                  alimentarias actuales.
                </p>
                <p>
                  Fundada por una familia apasionada por la gastronomía venezolana, comenzamos 
                  experimentando con harinas de plátano y yuca para crear alternativas saludables 
                  y sin gluten a nuestros alimentos favoritos.
                </p>
                <p>
                  Hoy, Al Natural es sinónimo de calidad, sabor auténtico y compromiso con 
                  la salud de nuestros consumidores, manteniendo siempre el amor por lo natural 
                  y lo venezolano.
                </p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">2022</h3>
                    <p className="text-sm text-muted-foreground">Fundación de Al Natural</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">2023</h3>
                    <p className="text-sm text-muted-foreground">Certificaciones y Permisos Sanitarios </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">2024</h3>
                    <p className="text-sm text-muted-foreground">Expansión nacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Mejorar la salud y el bienestar de las familias venezolanas ofreciendo 
                  productos alimenticios nutritivos, libres de gluten y elaborados con 
                  ingredientes naturales de la más alta calidad, preservando el sabor 
                  auténtico de nuestra gastronomía tradicional.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center">Nuestra Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Ser la empresa líder en Venezuela en productos alimenticios sin gluten, 
                  reconocida por la calidad excepcional de nuestros productos, nuestro 
                  compromiso con la sostenibilidad y por llevar el auténtico sabor venezolano 
                  a cada mesa del país.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Valores */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Nuestros Valores</h2>
            <p className="text-lg text-muted-foreground">
              Los principios que guían cada decisión en Al Natural
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Frescura</h3>
                <p className="text-muted-foreground text-sm">
                  Productos siempre frescos, elaborados con ingredientes seleccionados del día.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Calidad</h3>
                <p className="text-muted-foreground text-sm">
                  Estándares de calidad excepcionales en cada etapa del proceso productivo.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Sostenibilidad</h3>
                <p className="text-muted-foreground text-sm">
                  Compromiso con el medio ambiente y prácticas responsables.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Cercanía</h3>
                <p className="text-muted-foreground text-sm">
                  Relación cercana con nuestros clientes y comunidades locales.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>;
};
export default Nosotros;