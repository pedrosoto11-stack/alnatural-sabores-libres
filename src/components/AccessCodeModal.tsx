import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessCodeModal = ({ isOpen, onClose }: AccessCodeModalProps) => {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    
    try {
      const success = await login(code);
      
      if (success) {
        toast({
          title: "Acceso concedido",
          description: "Ahora puedes ver precios y realizar pedidos",
        });
        setCode("");
        onClose();
      } else {
        toast({
          title: "Código inválido",
          description: "El código ingresado no es válido. Contacta a tu asesor.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al validar el código. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Acceso para Distribuidores
          </DialogTitle>
          <DialogDescription>
            Ingresa tu código de acceso para ver precios y realizar pedidos
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showCode ? "text" : "password"}
              placeholder="Ingresa tu código de acceso"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="pr-10"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark"
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? "Verificando..." : "Ingresar"}
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          ¿No tienes código? <br />
          <Button variant="link" className="p-0 h-auto text-primary">
            Contacta a nuestro equipo comercial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};