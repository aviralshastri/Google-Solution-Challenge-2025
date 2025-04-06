"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get("auth_token");
      try {
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
      
        const baseUrl = process.env.BASE_URL || window.location.origin;
        const verifyUrl = `${baseUrl}/api/auth/token-verify`;
        
        const verifyResponse = await fetch(verifyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const verifyResult = await verifyResponse.json();
        if (verifyResult.valid) {
          setIsAuthenticated(true);
          return;
        }
        setIsAuthenticated(false);
      } catch (error) {
        console.error("AuthContextError:", error);
        setIsAuthenticated(false);
      }
    };
    
    verifyToken();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const authContextValue = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}