import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeBusinessId: localStorage.getItem("storeProfile_id") || null,
  activeBusinessName: "Select Business",
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setActiveBusiness: (state, action) => {
      const { id, name } = action.payload;
      state.activeBusinessId = id;
      state.activeBusinessName = name;

      // persist karo
      localStorage.setItem("storeProfile_id", id);
    },
  },
});

export const { setActiveBusiness } = businessSlice.actions;
export default businessSlice.reducer;
