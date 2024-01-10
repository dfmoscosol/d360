import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Outlet } from "react-router-dom";

const PrivateRoute = () => {

  const isLogged = useSelector((state) => state.authState.isLogged);
  const hasExpired = useSelector((state) => state.authState.hasExpired);

  const location = useLocation();

  if (!isLogged) {
    // Recarga la página y redirige al login
    console.log("redirigiendo al login sin token");
    window.location.href = `/login`;
    return null;
  }

  if (hasExpired) {
    window.location.href = `/login?from=${encodeURIComponent(
      location.pathname
    )}&expired=true`;
    return null;
  }

  return (
    <main>    
      <Outlet />
    </main>
  );
};

export default PrivateRoute;
