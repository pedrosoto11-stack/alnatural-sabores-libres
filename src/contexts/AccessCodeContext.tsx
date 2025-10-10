import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

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
  const { isAuthenticated, client, login, logout } = useAuth();

  const validateAccessCode = async (code: string): Promise<boolean> => {
    return await login(code);
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