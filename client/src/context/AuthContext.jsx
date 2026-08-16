import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      // No token means user is not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        console.log("RESTORED USER:", response.data);

        setUser(response.data.user);

      } catch (error) {
        console.error("Failed to restore user:", error);

        // Token invalid or expired
        localStorage.removeItem("token");
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);