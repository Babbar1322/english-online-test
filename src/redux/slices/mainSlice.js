import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    setLogout: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setLogin, setLogout, setToken } = mainSlice.actions;

export const selectIsLoggedIn = (state) => state.main.isLoggedIn;
export const selectUser = (state) => state.main.user;
export const selectToken = (state) => state.main.token;

export default mainSlice.reducer;
