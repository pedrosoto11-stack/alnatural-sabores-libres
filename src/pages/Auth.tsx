import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({ email: "", password: "" });
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (user) {
    navigate("/");
    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.email || !signUpData.password) return;

    setIsLoading(true);
    try {
      const { error } = await signUp(signUpData.email, signUpData.password);
      
      if (error) {
        toast({
          title: "Error al registrarse",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registro exitoso",
          description: "Revisa tu email para confirmar tu cuenta",
        });
        setSignUpData({ email: "", password: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) return;

    setIsLoading(true);
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        toast({
          title: "Error al iniciar sesión",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión exitosamente",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Al Natural</CardTitle>
          <CardDescription>
            Accede a tu cuenta para gestionar pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      className="pr-10"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crea una contraseña"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      className="pr-10"
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mínimo 6 caracteres
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>¿Ya tienes un código de acceso?</p>
            <p>Regístrate o inicia sesión primero, luego úsalo en el catálogo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}