import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import sideBarReducer from "@redux/features/sidebar/sideBarSlice";
import notificationReducer from "@redux/features/notification/notificationSlice";

import { eventoApi } from "./services/evento/eventoApi";
import { tallerApi } from "./services/taller/tallerApi";
import { keywordApi } from "./services/keyword/keywordApi";
import { docenteApi } from "./services/docente/docenteApi";

export const store = configureStore({
  reducer: {
    sidebarState: sideBarReducer,
    notificationState: notificationReducer,
    [eventoApi.reducerPath]: eventoApi.reducer,
    [tallerApi.reducerPath]: tallerApi.reducer,
    [keywordApi.reducerPath]: keywordApi.reducer,
    [docenteApi.reducerPath]: docenteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      eventoApi.middleware,
      tallerApi.middleware,
      keywordApi.middleware,
      docenteApi.middleware,
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
