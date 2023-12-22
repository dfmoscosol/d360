import { createSlice } from "@reduxjs/toolkit";

// initialize userToken from local storage
const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const initialState = {
  token,
  hasExpired: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state, action) => {
      state.token = null;
      localStorage.removeItem("token");
      state.hasExpired = action.payload;
    },
  },
});

// Exportar las acciones
export const { setToken, logout, setLoading } = authSlice.actions;

// Exportar el reducer
export default authSlice.reducer;
