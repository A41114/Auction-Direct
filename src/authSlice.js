import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  userInfo: null,
  token:null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLogin = true;     
      state.userInfo = action.payload.userInfo; // user info từ API
      state.token = action.payload.token;// token từ API
      
    },
    logout: (state) => {
      state.isLogin = false;
      state.userInfo = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
