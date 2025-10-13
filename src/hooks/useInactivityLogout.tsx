import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const resetTimer = () => {
    if (!isEnabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onLogout();
      toast({
        title: "Sesión expirada",
        description: "Tu sesión ha expirado por inactividad. Por favor, vuelve a ingresar tu código de acceso.",
        variant: "destructive",
      });
      navigate('/');
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    if (!isEnabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

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
  }, [isEnabled, timeoutMinutes]);
};
