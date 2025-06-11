import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  },
  reducers: {
    setUser: (state, action) => {
      const { token, role } = action.payload;
      state.token = token;
      state.role = role;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    },

    logoutUser: (state) => {
      state.token = null;
      state.role = null;
      localStorage.clear();
    },
  }
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer