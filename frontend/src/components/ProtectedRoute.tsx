import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] text-sm text-stone-500">
        Restoring your session...
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;