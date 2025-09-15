import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { api } from '@/lib/api'
import { fetchNotifications } from './notificationSlice'

interface User { 
  id: number; 
  name: string; 
  email: string; 
  role: 'seller' | 'buyer';
  contactNumber?: string;
  deliveryAddress?: string;
  businessAddress?: string;
  cnicNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

interface AuthState {
  user?: User
  token?: string
  loading: boolean
  logoutLoading: boolean
  error?: string
}

function loadUser(): User | undefined {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) as User : undefined
  } catch { return undefined }
}

const initialState: AuthState = { 
  loading: false,
  logoutLoading: false,
  token: localStorage.getItem('token') || undefined,
  user: loadUser()
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/login`, payload)
      const data = res.data as { token: string; user: User }
      
      // Fetch notifications after successful login
      if (data.user.role === 'seller') {
        dispatch(fetchNotifications({ page: 1, limit: 20 }))
      }
      
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: { 
    name: string; 
    email: string; 
    password: string; 
    role: 'buyer' | 'seller';
    contactNumber: string;
    deliveryAddress?: string;
    businessAddress?: string;
    cnicNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;
  }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/register`, payload)
      const { token, ...userData } = res.data
      
      // If token is provided, automatically login the user
      if (token) {
        localStorage.setItem('token', token)
        
        // Dispatch login action to update state
        dispatch(login.fulfilled({ user: userData, token }, '', { email: payload.email, password: payload.password }))
        
        // Fetch notifications for sellers
        if (userData.role === 'seller') {
          dispatch(fetchNotifications({ page: 1, limit: 20 }))
        }
      }
      
      return res.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue, getState, dispatch }) => {
  try {
    const state = getState() as any
    const token: string | undefined = state.auth?.token || localStorage.getItem('token') || undefined
    if (!token) throw new Error('No token')
    const res = await axios.get<User>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Fetch notifications for sellers when app loads
    if (res.data.role === 'seller') {
      dispatch(fetchNotifications({ page: 1, limit: 20 }))
    }
    
    return { user: res.data, token }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Unauthorized')
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  // Add a 1-second delay to show loading screen
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Clear authentication data
  dispatch(logout())
  return true
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = undefined
      state.token = undefined
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      try { delete (api as any).defaults.headers.common.Authorization } catch {}
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
        try { 
          localStorage.setItem('token', action.payload.token)
          localStorage.setItem('user', JSON.stringify(action.payload.user))
          api.defaults.headers.common.Authorization = `Bearer ${action.payload.token}`
        } catch {}
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message
      })
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = undefined
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ id: number; name: string; email: string; role: 'buyer' | 'seller' }>) => {
        state.loading = false
        state.user = action.payload
        state.error = undefined
        try { localStorage.setItem('user', JSON.stringify(action.payload)) } catch {}
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message
      })
      .addCase(fetchCurrentUser.pending, state => {
        state.loading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false
        // Guard against stale responses: only accept if token matches current one
        try {
          const current = localStorage.getItem('token') || state.token
          if (current && current !== action.payload.token) {
            return
          }
        } catch {}
        state.user = action.payload.user
        state.token = action.payload.token
        try {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
          localStorage.setItem('token', action.payload.token)
          api.defaults.headers.common.Authorization = `Bearer ${action.payload.token}`
        } catch {}
      })
      .addCase(fetchCurrentUser.rejected, state => {
        state.loading = false
        // Clear auth state if token validation fails
        state.user = undefined
        state.token = undefined
        try {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          delete api.defaults.headers.common.Authorization
        } catch {}
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false
        state.user = undefined
        state.token = undefined
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        try { delete (api as any).defaults.headers.common.Authorization } catch {}
      })
      .addCase(logoutUser.rejected, (state) => {
        state.logoutLoading = false
        state.user = undefined
        state.token = undefined
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        try { delete (api as any).defaults.headers.common.Authorization } catch {}
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer


