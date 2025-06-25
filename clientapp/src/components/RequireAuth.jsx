import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    fetch('/api/Account/accountProfile', { credentials: 'include' })
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);
  return isAuthenticated;
}

export { useAuthCheck };

export function RequireAuth({ children }) {
  const isAuthenticated = useAuthCheck();
  const location = useLocation();
  if (isAuthenticated === null) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RedirectIfAuth({ children }) {
  const isAuthenticated = useAuthCheck();
  if (isAuthenticated === null) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
