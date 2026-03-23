import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({ email, password });

      setUser(data.user);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      // ✅ DO NOT set user here (VERY IMPORTANT)
      await register({ username, email, password });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      setUser(null);

      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REFRESH USER ---------------- */

  const refreshUser = async () => {
    try {
      const data = await getMe();

      if (data) {
        setUser(data.user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- INITIAL AUTH CHECK ---------------- */

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        if (data) {
          setUser(data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // ✅ ALWAYS stop loading
      }
    };

    getAndSetUser();
  }, []); // ❗ no user dependency (important)

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
    refreshUser,
  };
};