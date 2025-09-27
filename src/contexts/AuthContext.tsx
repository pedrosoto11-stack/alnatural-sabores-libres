import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  accessCode: string | null;
  user: User | null;
  session: Session | null;
  client: any | null;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [client, setClient] = useState<any | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has a linked client
          setTimeout(async () => {
            try {
              const { data: userClient } = await supabase
                .from("user_clients")
                .select(`
                  client_id,
                  clients (
                    id,
                    name,
                    email,
                    company
                  )
                `)
                .eq("user_id", session.user.id)
                .single();

              if (userClient) {
                setIsAuthenticated(true);
                setClient(userClient.clients);
                setAccessCode("LINKED");
              } else {
                setIsAuthenticated(false);
                setClient(null);
                setAccessCode(null);
              }
            } catch (error) {
              console.error("Error fetching user client:", error);
            }
          }, 0);
        } else {
          setIsAuthenticated(false);
          setClient(null);
          setAccessCode(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (code: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const { data, error } = await supabase.functions.invoke('link-client', {
        body: { accessCode: code }
      });

      if (error) {
        console.error("Error linking client:", error);
        return false;
      }

      if (data.success) {
        setIsAuthenticated(true);
        setAccessCode(code);
        setClient(data.client);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessCode(null);
    setClient(null);
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAccessCode(null);
    setClient(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      accessCode,
      user,
      session,
      client,
      login,
      logout,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};