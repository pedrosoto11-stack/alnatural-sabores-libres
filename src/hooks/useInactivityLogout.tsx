import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseInactivityLogoutProps {
  onLogout: () => void;
  timeoutMinutes?: number;
  isEnabled: boolean;
}

export const useInactivityLogout = ({ 
  onLogout, 
  timeoutMinutes = 15,
  isEnabled 
}: UseInactivityLogoutProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isEnabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        toast({
          title: "Sesión expirada",
          description: "Tu sesión ha expirado por inactividad. Por favor, vuelve a ingresar tu código de acceso.",
          variant: "destructive",
        });
        onLogout();
      }, timeoutMinutes * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isEnabled, timeoutMinutes, onLogout, toast]);
};
