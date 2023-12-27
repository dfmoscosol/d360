import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { redirect } from "react-router-dom";

const PrivateRoute = () => {
  const token = useSelector((state) => state.authState.token);
  const location = useLocation();

  if (!token) {
    // Recarga la página y redirige al login
    window.location.href = `/login?from=${encodeURIComponent(
      location.pathname
    )}&expired=true`;
    return null; // Este return es necesario para evitar que se renderice algo antes de la redirección
  } /**/

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default PrivateRoute;
