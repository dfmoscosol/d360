import React from "react";
import { Navigate } from "react-router-dom";
import { PathConstants } from "./pathConstants";

import {
  MdDashboard,
  MdOutlineEvent,
  MdOutlineTextSnippet,
  MdFormatListBulleted,
  MdEventNote,
} from "react-icons/md";

import { BsClockHistory } from "react-icons/bs";

import { PiCertificate } from "react-icons/pi";

const Eventos = React.lazy(() => import("@pages"));
const Acreditacion = React.lazy(() => import("@pages"));
const Certificados = React.lazy(() => import("@pages"));
const HorasFormacionReport = React.lazy(() => import("@pages"));

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
        element: <Certificados />,
        name: "Certificados",
        icon: <MdOutlineTextSnippet size={20} />,
      },
    ],
  },
  {
    title: "REPORTES",
    routes: [
      {
        path: PathConstants.REPORTE_HORAS,
        element: <HorasFormacionReport />,
        name: "Horas de Formación",
        icon: <BsClockHistory size={20} />,
      },
      {
        path: PathConstants.REPORTE_EVENTOS,
        //element: <Eventos />,
        name: "Eventos",
        icon: <MdEventNote  size={20} />,
      }
    ],
  },
  //{ path: PathConstants.PAGE1, element: <Page1 />, name: "Page1", icon: <MdDashboard size={20} />, },
  //{ path: PathConstants.PAGE2, element: <Page2 />, name: "Page2", icon: <MdDashboard size={20} />, },
];

export default routes;
