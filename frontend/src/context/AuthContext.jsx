import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  useEffect(() => {
    if (fullName) {
      localStorage.setItem("fullName", fullName);
    } else {
      localStorage.removeItem("fullName");
    }
  }, [fullName]);

  const login = (newToken, newRole, newFullName) => {
    setToken(newToken);
    setRole(newRole);
    setFullName(newFullName);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setFullName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}