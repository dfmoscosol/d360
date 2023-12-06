import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isVisible: false,
  message: "",
  type: "",
  isError: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.isVisible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isError = action.payload.type === "error";
    },
    hideNotification(state) {
      state.isVisible = false;
      state.message = "";
      state.type = "";
      state.isError = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

// Función para mostrar notificación con temporizador
export const triggerNotification = (dispatch, notificationData) => {
  dispatch(showNotification(notificationData));
  setTimeout(() => {
    dispatch(hideNotification());
  }, 8000);
};

export default notificationSlice.reducer;
