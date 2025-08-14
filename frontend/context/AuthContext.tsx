import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  axios.get<User>("http://localhost:3001/auth/me", { withCredentials: true })
    .then((res) => setUser(res.data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
}, []);


  function logout() {
    axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true })
      .then(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
