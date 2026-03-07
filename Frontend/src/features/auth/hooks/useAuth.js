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

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await register({ username, email, password });

      setUser(data.user);

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
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

    if (user !== null) return;

    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        if (data) setUser(data.user);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();

  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
    refreshUser
  };

};