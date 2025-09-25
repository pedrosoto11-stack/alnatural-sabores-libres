import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    orderType: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    // Create WhatsApp message
    const whatsappMessage = `¡Hola Al Natural! 
    
Nombre: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Teléfono: ${formData.phone}` : ''}
${formData.orderType ? `Tipo de pedido: ${formData.orderType}` : ''}

Mensaje: ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/584241234567?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "¡Mensaje enviado!",
      description: "Te hemos redirigido a WhatsApp para completar tu consulta",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      orderType: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      content: "+58 424-123-4567",
      subtitle: "Lun - Vie: 8:00 AM - 6:00 PM"
    },
    {
      icon: Mail,
      title: "Email",
      content: "pedidos@alnatural.com.ve",
      subtitle: "Respuesta en 24 horas"
    },
    {
      icon: MapPin,
      title: "Ubicación", 
      content: "Caracas, Venezuela",
      subtitle: "Entregas a nivel nacional"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "+58 424-123-4567",
      subtitle: "Respuesta inmediata"
    }
  ];

  return (
    <main className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Contacto y Pedidos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ¿Listo para probar Al Natural? Contáctanos para hacer tu pedido o 
            resolver cualquier duda. ¡Estamos aquí para ayudarte!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Send className="h-6 w-6 text-primary" />
                  <span>Haz tu pedido</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Completa el formulario y nos pondremos en contacto contigo
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0424-123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orderType">Tipo de consulta</Label>
                    <select
                      id="orderType"
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-input rounded-lg bg-background"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="pedido-productos">Pedido de productos</option>
                      <option value="informacion-productos">Información sobre productos</option>
                      <option value="distribuidor">Quiero ser distribuidor</option>
                      <option value="soporte">Soporte técnico</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos qué productos te interesan o cualquier pregunta que tengas..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                    Enviar mensaje por WhatsApp
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Al enviar este formulario, serás redirigido a WhatsApp para completar tu consulta
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
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
                  </Card>
                );
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
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => window.open('https://wa.me/584241234567?text=¡Hola! Quiero información sobre productos Al Natural', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat por WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => window.location.href = 'mailto:pedidos@alnatural.com.ve'}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => window.location.href = 'tel:+584241234567'}
                >
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
                <h3 className="font-semibold mb-2">¿Hacen entregas a domicilio?</h3>
                <p className="text-sm text-muted-foreground">
                  Sí, realizamos entregas en Caracas y área metropolitana. Para otras ciudades, 
                  trabajamos con servicios de envío confiables.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent>
                <h3 className="font-semibold mb-2">¿Cuál es el pedido mínimo?</h3>
                <p className="text-sm text-muted-foreground">
                  No tenemos pedido mínimo. Sin embargo, para entregas a domicilio aplicamos 
                  un costo de envío que varía según la zona.
                </p>
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
                <h3 className="font-semibold mb-2">¿Tienen certificación sin gluten?</h3>
                <p className="text-sm text-muted-foreground">
                  Sí, todos nuestros productos cuentan con certificación oficial libre de gluten 
                  y son seguros para personas celíacas.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contacto;