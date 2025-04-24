// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Defina os tipos para o contexto
interface AuthContextType {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false); // O estado inicial pode ser 'false' para usuário comum

  const toggleAdmin = () => {
    setIsAdmin((prev) => !prev); // Alterna entre 'admin' e 'usuário'
  };

  return (
    <AuthContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
