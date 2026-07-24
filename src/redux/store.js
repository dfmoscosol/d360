import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import sideBarReducer from "@redux/features/sidebar/sideBarSlice";
import notificationReducer from "@redux/features/notification/notificationSlice";
import authReducer from "@redux/features/auth/authSlice";

import { eventoApi } from "./services/evento/eventoApi";
import { tallerApi } from "./services/taller/tallerApi";
import { keywordApi } from "./services/keyword/keywordApi";
import { docenteApi } from "./services/docente/docenteApi";
import { inscripcionApi } from "./services/inscripcion/inscripcionApi";
import { certificadoApi } from "./services/certificado/certificadoApi";
import { loginApi } from "./services/login/loginApi";
import { reportesApi } from "./services/reportes/reportesApi";
import { competenciaApi } from "./services/competencia/competenciaApi";

export const store = configureStore({
  reducer: {
    sidebarState: sideBarReducer,
    notificationState: notificationReducer,
    authState: authReducer,
    [eventoApi.reducerPath]: eventoApi.reducer,
    [tallerApi.reducerPath]: tallerApi.reducer,
    [keywordApi.reducerPath]: keywordApi.reducer,
    [docenteApi.reducerPath]: docenteApi.reducer,
    [inscripcionApi.reducerPath]: inscripcionApi.reducer,
    [certificadoApi.reducerPath]: certificadoApi.reducer,
    [reportesApi.reducerPath]: reportesApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [competenciaApi.reducerPath]: competenciaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      eventoApi.middleware,
      tallerApi.middleware,
      keywordApi.middleware,
      docenteApi.middleware,
      inscripcionApi.middleware,
      certificadoApi.middleware,
      loginApi.middleware,
      reportesApi.middleware,
      competenciaApi.middleware
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
