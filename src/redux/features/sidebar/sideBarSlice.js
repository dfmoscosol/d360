import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
  isOpen: true
};

export const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setOpen } = sideBarSlice.actions;
export default sideBarSlice.reducer;