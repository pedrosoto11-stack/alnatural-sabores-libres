import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
const Contacto = () => {
  const contactInfo = [{
    icon: Phone,
    title: "Teléfono",
    content: "+58 424-776-8813 / 4147281366",
    subtitle: "Lun - Vie: 8:00 AM - 6:00 PM"
  }, {
    icon: Mail,
    title: "Email",
    content: "soloalnatural1@gmail.com",
    subtitle: "Respuesta en 24 horas"
  }, {
    icon: MapPin,
    title: "Ubicación",
    content: "Tovar estado Mérida, Venezuela",
    subtitle: "Entregas a nivel nacional"
  }, {
    icon: MessageCircle,
    title: "WhatsApp",
    content: "+58 412-456-6318",
    subtitle: "Respuesta inmediata"
  }];
  return <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Contacto
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ¿Tienes preguntas sobre nuestros productos? Contáctanos y estaremos 
            encantados de ayudarte con toda la información que necesites.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <CardContent className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{info.title}</h3>
                        <p className="text-primary font-medium">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>;
            })}
            </div>

            {/* Business Hours */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Horarios de Atención</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lunes - Viernes:</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sábados:</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domingos:</span>
                  <span className="font-medium">Cerrado</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <span className="font-medium text-primary">24/7 disponible</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={() => window.open('https://wa.me/584124566318?text=¡Hola! Quiero información sobre productos Al Natural', '_blank')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat por WhatsApp
                </Button>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={() => window.location.href = 'mailto:soloalnatural1@gmail.com'}>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={() => window.location.href = 'tel:+584124566318'}>
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar Ahora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <CardContent>
                <h3 className="font-semibold mb-2">¿Hacen entregas a mi negocio?</h3>
                <p className="text-sm text-muted-foreground">Sí. Al ser 100% naturales y sin conservantes, deben mantenerse en frío. Para prolongar su vida útil, consérvalos a ≤ 0 °C (congelados) Procura guardar de inmediato al recibirlos y no romper la cadena de frío. </p>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent>
                <h3 className="font-semibold mb-2">¿Cuál es el pedido mínimo?</h3>
                <p className="text-sm text-muted-foreground">No tenemos pedido mínimo. Si quieres vender o distribuir nuestros productos, contáctanos y te asignamos tu código de acceso para ver precios y hacer pedidos..</p>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent>
                <h3 className="font-semibold mb-2">¿Los productos requieren refrigeración?</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestros productos pueden mantenerse a temperatura ambiente por períodos cortos, 
                  pero recomendamos refrigeración para mayor durabilidad.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent>
                <h3 className="font-semibold mb-2">¿Permisos sanitarios?</h3>
                <p className="text-sm text-muted-foreground">Sí. Operamos con permisos sanitarios en regla. Estos documentos se actualizan periódicamente; si necesitas la versión vigente para auditorías o compras institucionales, te la enviamos por correo.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>;
};
export default Contacto;