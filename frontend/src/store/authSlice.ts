import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface User { id: number; name: string; email: string; role: 'admin' | 'user' }

interface AuthState {
  user?: User
  token?: string
  loading: boolean
  error?: string
}

const initialState: AuthState = { 
  loading: false,
  token: localStorage.getItem('token') || undefined,
  user: undefined
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/login`, payload)
      return res.data as { token: string; user: User }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string; role: 'user' | 'admin' }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/register`, payload)
      return res.data as { id: number; name: string; email: string; role: 'user' | 'admin' }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = undefined
      state.token = undefined
      localStorage.removeItem('token')
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true
        state.error = undefined
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        try { localStorage.setItem('token', action.payload.token) } catch {}
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || action.error.message
      })
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = undefined
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ id: number; name: string; email: string; role: 'user' | 'admin' }>) => {
        state.loading = false
        state.user = action.payload
        state.error = undefined
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || action.error.message
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer


