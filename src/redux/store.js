import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import sideBarReducer from "@redux/features/sidebar/sideBarSlice";

import { eventoApi } from "./services/evento/eventoApi";

export const store = configureStore({
  reducer: {
    sidebarState: sideBarReducer,
    [eventoApi.reducerPath]: eventoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([eventoApi.middleware]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
