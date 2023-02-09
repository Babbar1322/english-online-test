import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = true;
      state.user = {
        name: 'Ravi Kumar',
        email: 'ravi@gmail.com',
        phone: 9876543210,
      };
    },
    setLogout: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { setLogin, setLogout } = mainSlice.actions;

export const selectIsLoggedIn = (state) => state.main.isLoggedIn;
export const selectUser = (state) => state.main.user;

export default mainSlice.reducer;
