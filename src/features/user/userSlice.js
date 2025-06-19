import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    name: localStorage.getItem('name') || null,
    department: localStorage.getItem('department') || null,
  },
  reducers: {
    setUser: (state, action) => {
      const { token, role, name } = action.payload;
      state.token = token;
      state.role = role;
      state.name = name;
      state.department = action.payload.department || null;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      if (action.payload.department) {
        localStorage.setItem('department', action.payload.department);
      } else {
        localStorage.removeItem('department');
      }
    },

    logoutUser: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      state.department = null;
      localStorage.clear();
    },
  }
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer