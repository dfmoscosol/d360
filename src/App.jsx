import "./App.css";

import React, { useEffect } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import LoginLayout from "./layouts/LoginLayout/LoginLayout";

import { PrivateRoute } from "@components";

import {
  Home,
  About,
  Page404,
  Page1,
  Page2,
  Eventos,
  Acreditacion,
  VerEvento,
  EditarEvento,
  CrearJornadaInnovacion,
  CrearCharla,
  CrearTaller,
  CrearObservacionAulica,
  NuevoEvento,
  Keywords,
  Certificados,
  Login,
} from "@pages";

import { PathConstants } from "@routes/pathConstants";
import ReportesDocentes from "./pages/Reportes/HorasFormacionReport";

function App() {
  // Para verificar si hay token en el local storage
  /*const dispatch = useDispatch();
  useEffect(() => {
    console.log("verificando token");
    const token = localStorage.getItem("token");
    if (token) {
      console.log("token existe");
      //dispatch(setToken(token));
      //dispatch(setLoading(false));
    } else {
      console.log("token noooooooo existe");
    }
    dispatch(setLoading(false));
  }, [dispatch]); /**/

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          element: <PrivateRoute />,
          children: [
            /**/ {
              path: "/",
              element: <Navigate to={PathConstants.EVENTOS} />,
            },
            {
              path: "/pentagono",
              element: <Navigate to={`/${PathConstants.EVENTOS}`} />,
            },
            {
              path: "/about",
              element: <About />,
            },
            {
              path: "/eventos",
              element: <Eventos />,
            },
            {
              path: "/acreditacion",
              element: <Acreditacion />,
            },
            {
              path: "eventos/verEvento/:idEvento",
              element: <VerEvento />,
            },
            {
              path: "eventos/editarEvento/:idEvento",
              element: <EditarEvento />,
            },
            {
              path: "eventos/nuevoEvento",
              element: <NuevoEvento />,
            },
            {
              path: "eventos/nuevoEvento/jornadaInnovacion",
              element: <CrearJornadaInnovacion />,
            },
            {
              path: "eventos/nuevoEvento/charla",
              element: <CrearCharla />,
            },
            {
              path: "eventos/nuevoEvento/microtaller",
              element: <CrearTaller />,
            },
            {
              path: "eventos/nuevoEvento/observacionAulica",
              element: <CrearObservacionAulica />,
            },
            {
              path: "pentagono/keywords",
              element: <Keywords />,
            },
            {
              path: "/certificados",
              element: <Certificados />,
            },
            {
              path: "/reportes/horas",
              element: <ReportesDocentes />,
            },
            {
              path: "/reportes/capacitaciones",
              element: <Certificados />,
            },

            {
              path: "/page1",
              element: <Page1 />,
            },
            {
              path: "/page2",
              element: <Page2 />,
            },
          ],
        },
      ],
      errorElement: <Page404 />,
    },
    {
      path: "/login",
      element: <LoginLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
      ],
      errorElement: <Page404 />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
