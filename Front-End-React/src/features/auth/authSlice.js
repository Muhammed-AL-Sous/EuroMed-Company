import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  authReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = !!user;
    },
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthReady: (state, action) => {
      state.authReady = action.payload;
    },
  },
});

export const { setCredentials, logOut, setAuthReady } = authSlice.actions;

// ✅ Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthReady = (state) => state.auth.authReady;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
