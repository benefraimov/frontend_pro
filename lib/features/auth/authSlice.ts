import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

// Helper function to get cookie
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number) => {
    if (typeof document === 'undefined') return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// Helper function to erase cookie
const eraseCookie = (name: string) => {   
    if (typeof document === 'undefined') return;
    document.cookie = name+'=; Max-Age=-99999999;';  
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      const { token } = response.data;
      const decoded: { sub: User } = jwtDecode(token);
      setCookie('token', token, 1);
      return { token, user: decoded.sub };
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      await api.post('/register', credentials);
      toast.success('Registration successful! Please log in.');
      return;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      eraseCookie('token');
      toast.success('Logged out successfully');
    },
    hydrateAuth: (state) => {
        const token = getCookie('token');
        if (token) {
            const decoded: { sub: User; exp: number } = jwtDecode(token);
            // Check if token is expired
            if (Date.now() < decoded.exp * 1000) {
                state.token = token;
                state.isAuthenticated = true;
                state.user = decoded.sub;
            } else {
                // Token is expired, erase it
                eraseCookie('token');
            }
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        toast.success('Welcome back!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
