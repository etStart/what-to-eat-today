import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-text-secondary">
        正在检查登录状态...
      </div>
    );
  }

  if (!user) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  return <Outlet />;
}
