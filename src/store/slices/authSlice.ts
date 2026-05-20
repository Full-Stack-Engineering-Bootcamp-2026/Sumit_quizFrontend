import { createSlice } from "@reduxjs/toolkit";

interface UserProfile {
  publicId: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action
    ) => {
      state.token =
        action.payload.token;

      state.user =
        action.payload.user;

      state.isAuthenticated =
        true;
    },

    logout: (state) => {
      state.token = null;

      state.user = null;

      state.isAuthenticated =
        false;
    },
  },
});

export const {
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;