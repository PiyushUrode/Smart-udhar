import { configureStore } from "@reduxjs/toolkit";
import businessReducer from "../reactStore/businessSlice.js";

export const store = configureStore({
  reducer: {
    business: businessReducer,
  },
});
