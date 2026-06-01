import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import { login, register, AuthUser } from "./services/auth";
import { getStoredUser, setStoredToken, setStoredUser } from "./services/api";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setPage("dashboard");
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
      setUser(response.usuario);
      setStoredToken(response.token);
      setStoredUser(response.usuario);
      setPage("dashboard");
    } catch (err: any) {
      setError(err?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setError(null);
    setLoading(true);

    try {
      await register(data);
      setPage("login");
    } catch (err: any) {
      setError(err?.message || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setStoredToken(null);
    setStoredUser(null);
    setUser(null);
    setPage("home");
  };

  return (
    <>
      {page === "home" && <Home onNavigate={setPage} />}

      {page === "login" && (
        <Login
          onNavigateToRegister={() => setPage("register")}
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      )}

      {page === "register" && (
        <Register
          onNavigateToLogin={() => setPage("login")}
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />
      )}

      {page === "dashboard" && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
