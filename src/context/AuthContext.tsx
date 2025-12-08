import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check expiration
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired");
          setBaseToken(null);
          return;
        }

        setUser({
          id: decoded.sub,
          name: decoded.name || decoded.email, // Fallback
          role: decoded.role || "User", // Fallback
          email: decoded.email
        });
        localStorage.setItem("token", token);
      } catch (err) {
        console.error("Invalid token:", err);
        setBaseToken(null); // Clear invalid token
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  // Helper to update state and storage
  const setBaseToken = (newToken: string | null) => {
    setToken(newToken);
    if (!newToken) {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const login = (newToken: string) => {
    setBaseToken(newToken);
  };

  const logout = () => {
    setBaseToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


