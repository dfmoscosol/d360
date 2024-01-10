import { createSlice } from "@reduxjs/toolkit";

let token = localStorage.getItem("token");
let hasExpired;
let isLogged;

if (token) {
  console.log("auth slice have token")
  hasExpired = false;
  isLogged = true;
} else {
  console.log("auth slice NOOO token")
  token = null;
  hasExpired = false;
  isLogged = false;
}

const initialState = {
  token:token,
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
