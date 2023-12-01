import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { MainLayout } from "@layouts/MainLayout";
import {
  Home,
  About,
  Page404,
  Page1,
  Page2,
  Eventos,
  VerEvento,
  EditarEvento,
  CrearJornadaInnovacion,
  CrearCharla,
  CrearTaller,
  CrearObservacionAulica
} from "@pages";

import { PathConstants } from "@routes/pathConstants";

function App() {
  const router = createBrowserRouter([
    {
      // parent route component
      element: <MainLayout />,
      // child route components
      children: [
        {
          path: "/",
          element: <Navigate to={PathConstants.EVENTOS} />,
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
          path: "eventos/verEvento/:idEvento",
          element: <VerEvento />,
        },
        {
          path: "eventos/editarEvento/:idEvento",
          element: <EditarEvento />,
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
          path: "eventos/nuevoEvento/taller",
          element: <CrearTaller />,
        },
        {
          path: "eventos/nuevoEvento/observacionAulica",
          element: <CrearObservacionAulica />,
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
      errorElement: <Page404 />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

/**
 * {
  path: "/eventos",
  element: <Eventos />,
  children: [
    {
      path: "ver/:id",
      element: <VerEvento />,
    },
    {
      path: "editar/:id",
      element: <EditarEvento />,
    },
  ],
},
 */

/**
 * import { useParams } from 'react-router-dom';

function VerEvento() {
  let { id } = useParams();
  
  // Ahora puedes usar el id para cargar datos dinámicos
}

function EditarEvento() {
  let { id } = useParams();
  
  // Ahora puedes usar el id para cargar datos dinámicos
}
 */
