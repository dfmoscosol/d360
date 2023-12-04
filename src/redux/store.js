import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import sideBarReducer from "@redux/features/sidebar/sideBarSlice";

import { eventoApi } from "./services/evento/eventoApi";
import { tallerApi } from "./services/taller/tallerApi";
import { keywordApi } from "./services/keyword/keywordApi";

export const store = configureStore({
  reducer: {
    sidebarState: sideBarReducer,
    [eventoApi.reducerPath]: eventoApi.reducer,
    [tallerApi.reducerPath]: tallerApi.reducer,
    [keywordApi.reducerPath]: keywordApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      eventoApi.middleware,
      tallerApi.middleware,
      keywordApi.middleware,
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
