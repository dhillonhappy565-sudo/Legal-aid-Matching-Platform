import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function PrivateRoute({ children, allowedRoles, requireVerified }) {
  const { user, accessToken, isHydrated } = useAuthStore();
  const location = useLocation();

  if (!isHydrated) {
    return (
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Checking session...</p>
      </div>
    );
  }

  if (!user || !accessToken) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (
    requireVerified &&
    (user.role === "Lawyer" || user.role === "NGO") &&
    !user.verified
  ) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}

export default PrivateRoute;
