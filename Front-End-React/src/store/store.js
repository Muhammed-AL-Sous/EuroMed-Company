import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
