import { createSlice } from "@reduxjs/toolkit";

let token = localStorage.getItem("token");
let hasExpired;
let isLogged;

if (token) {
  hasExpired = false;
  isLogged = true;
} else if (import.meta.env.DEV) {
  // Token JWT válido con rol de Experto DIE para desarrollo local
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc5MzgyODAzOSwianRpIjoiZGI0YjcxZDYtMzcyZS00NDc4LWIzZDEtMDdlN2NiYzZmYTQyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJpZCI6MSwibm9tYnJlIjoiRXhwZXJ0byBESUUiLCJzdWIiOiIxIn0sIm5iZiI6MTc5MzgyODAzOSwiY3NyZiI6ImNlZWQ5ZmRmLTAwNmQtNDZlMC04YzRkLWI3ZjdjZTYyM2RjZiIsImV4cCI6MjEwOTE4ODAzOX0.vVAEDL_Iccexo4XXqbA29lKUMThPPNN8iSLTy_tLaxM";
  hasExpired = false;
  isLogged = true;
} else {
  token = null;
  hasExpired = false;
  isLogged = false;
}

const initialState = {
  token: token,
  hasExpired: hasExpired,
  isLogged: isLogged,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isLogged = true;
      state.hasExpired = false;
    },
    setHasExpired: (state, action) => {
      state.hasExpired = action.payload;
    },
    logout: (state, action) => {
      state.token = null;
      state.isLogged = false;
      state.hasExpired = false;
      localStorage.removeItem("token");
    },
  },
});

// Exportar las acciones
export const { login, logout, setHasExpired } = authSlice.actions;

// Exportar el reducer
export default authSlice.reducer;
