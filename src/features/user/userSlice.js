import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    name: localStorage.getItem('name') || null,
  },
  reducers: {
    setUser: (state, action) => {
      const { token, role, name } = action.payload;
      state.token = token;
      state.role = role;
      state.name = name;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
    },

    logoutUser: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      localStorage.clear();
    },
  }
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer