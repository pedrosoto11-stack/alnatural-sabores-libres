import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  accessCode: string | null;
  login: (code: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Códigos válidos - en producción esto debería venir de una API segura
const VALID_CODES = ["AL2024", "NATURAL2024", "DISTRIBUIDOR"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verificar si hay un código válido guardado en localStorage
    const savedCode = localStorage.getItem('accessCode');
    return savedCode && VALID_CODES.includes(savedCode);
  });
  
  const [accessCode, setAccessCode] = useState<string | null>(() => {
    return localStorage.getItem('accessCode');
  });

  const login = (code: string): boolean => {
    const upperCode = code.toUpperCase().trim();
    if (VALID_CODES.includes(upperCode)) {
      setIsAuthenticated(true);
      setAccessCode(upperCode);
      localStorage.setItem('accessCode', upperCode);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessCode(null);
    localStorage.removeItem('accessCode');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      accessCode,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};