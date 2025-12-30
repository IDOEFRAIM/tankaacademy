"use client";

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode 
} from "react";
import { User, UserRole } from "@/types";

/**
 * Interface définissant les données accessibles globalement
 */
interface AuthContextType {
  user: User | null;
  userId: string | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Le Provider qui enveloppe l'application
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Ici, tu connecteras plus tard ton système d'authentification 
     * (ex: Clerk, NextAuth, ou une API custom)
     */
    const getSession = async () => {
      try {
        // Simulation d'une récupération de session
        // const session = await fetch("/api/auth/session");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  const value = {
    user,
    userId: user?.id || null,
    role: user?.role || null,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte facilement
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};