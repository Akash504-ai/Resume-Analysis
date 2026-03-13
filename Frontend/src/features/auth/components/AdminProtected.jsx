import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function AdminProtected({ children }) {

  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default AdminProtected;