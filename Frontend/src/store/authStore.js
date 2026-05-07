import { create } from 'zustand'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  login: async (userCred) => {
    try {
      set({
        loading: true,
        currentUser: null,
        isAuthenticated: false,
        error: null
      })
      let res = await axios.post(`${BASE_URL}/auth/login`, userCred, {
        withCredentials: true
      })
      if (res.status === 200) {
        localStorage.setItem('hasAuthToken', 'true')
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null
        })
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || 'Login failed'
      })
    }
  },
  logout: async () => {
    try {
      let res = await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true
      })
      if (res.status === 200) {
        localStorage.removeItem('hasAuthToken')
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false
        })
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || 'Logout failed'
      })
    }
  },
  checkAuth: async () => {
    try {
      if (!localStorage.getItem('hasAuthToken')) {
        set({ currentUser: null, isAuthenticated: false, loading: false })
        return
      }
      set({ loading: true })
      const res = await axios.get(`${BASE_URL}/auth/check-auth`, {
        withCredentials: true,
        validateStatus: (status) => status < 500
      })
      if (res.status === 200) {
        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false
        })
        return
      }
      set({ currentUser: null, isAuthenticated: false, loading: false })
      localStorage.removeItem('hasAuthToken')
    } catch (err) {
      console.error('Auth check failed:', err)
      set({ loading: false })
    }
  }
}))