import React from "react";
import { Navigate } from "react-router-dom";
import { PathConstants } from "./pathConstants";

import {
  MdDashboard,
  MdOutlineEvent,
  MdOutlineTextSnippet,
  MdFormatListBulleted,
} from "react-icons/md";
import { PiCertificate } from "react-icons/pi";

const Home = React.lazy(() => import("@pages"));
const About = React.lazy(() => import("@pages"));
const Page1 = React.lazy(() => import("@pages"));
const Page2 = React.lazy(() => import("@pages"));
const Eventos = React.lazy(() => import("@pages"));
const Acreditacion = React.lazy(() => import("@pages"));
const Keywords = React.lazy(() => import("@pages"));

// SOLO PARA EL SIDEBAR
const routes = [
  //{ path: PathConstants.HOME, element: <Home />, name: "Home" },
  //{ path: PathConstants.ABOUT, element: <About />, name: "About" },
  {
    title: "PRINCIPAL",
    routes: [
      {
        path: PathConstants.EVENTOS,
        element: <Eventos />,
        name: "Eventos",
        icon: <MdOutlineEvent size={20} />,
      },
      {
        path: PathConstants.ACREDITACION,
        element: <Acreditacion />,
        name: "Acreditacion",
        icon: <PiCertificate size={20} />,
      },
      {
        path: PathConstants.CERTIFICADOS,
        //element: <Eventos />,
        name: "Certificados",
        icon: <MdOutlineTextSnippet size={20} />,
      },
    ],
  },
  {
    title: "PENTÁGONO",
    routes: [
      {
        path: PathConstants.KEYWORDS,
        //element: <Eventos />,
        name: "Keywords",
        icon: <MdFormatListBulleted size={20} />,
      }
    ],
  },
  //{ path: PathConstants.PAGE1, element: <Page1 />, name: "Page1", icon: <MdDashboard size={20} />, },
  //{ path: PathConstants.PAGE2, element: <Page2 />, name: "Page2", icon: <MdDashboard size={20} />, },
];

export default routes;
