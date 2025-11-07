import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

interface AccessCodeContextType {
  isAuthenticated: boolean;
  client: any | null;
  validateAccessCode: (code: string) => Promise<boolean>;
  logout: () => void;
}

const AccessCodeContext = createContext<AccessCodeContextType | undefined>(undefined);

export const useAccessCode = () => {
  const context = useContext(AccessCodeContext);
  if (!context) {
    throw new Error('useAccessCode must be used within an AccessCodeProvider');
  }
  return context;
};

export const AccessCodeProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [client, setClient] = useState<any | null>(null);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setClient(null);
    localStorage.removeItem('al_natural_client');
    localStorage.removeItem('al_natural_access_code');
  }, []);

  // Enable inactivity logout only for access code authenticated clients
  useInactivityLogout({
    onLogout: logout,
    timeoutMinutes: 15,
    isEnabled: isAuthenticated
  });

  useEffect(() => {
    // Check localStorage for existing valid access code
    const storedClient = localStorage.getItem('al_natural_client');
    const storedCode = localStorage.getItem('al_natural_access_code');
    
    if (storedClient && storedCode) {
      try {
        const clientData = JSON.parse(storedClient);
        setClient(clientData);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('al_natural_client');
        localStorage.removeItem('al_natural_access_code');
      }
    }
  }, []);

  const validateAccessCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('validate_access_code', {
        access_code: code
      });

      if (error) {
        console.error("Error validating code:", error);
        return false;
      }

      if (data && typeof data === 'object' && 'valid' in data && data.valid) {
        const clientData = {
          id: (data as any).client_id,
          name: (data as any).client_name,
          email: (data as any).client_email,
          company: (data as any).client_company
        };
        
        // Get current user - but don't fail if not authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        // Only link if user is authenticated
        if (user) {
          try {
            const { error: linkError } = await supabase.functions.invoke('link-user-client', {
              body: { client_id: clientData.id }
            });
            
            if (linkError) {
              console.error("Error linking user to client:", linkError);
            } else {
              console.log("User successfully linked to client");
            }
          } catch (linkError) {
            console.error("Error in user-client linking:", linkError);
          }
        }
        
        setClient(clientData);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('al_natural_client', JSON.stringify(clientData));
        localStorage.setItem('al_natural_access_code', code.toUpperCase().trim());
        
        return true;
      }

      return false;
    } catch (error) {
      console.error("Access code validation error:", error);
      return false;
    }
  };

  return (
    <AccessCodeContext.Provider value={{
      isAuthenticated,
      client,
      validateAccessCode,
      logout
    }}>
      {children}
    </AccessCodeContext.Provider>
  );
};