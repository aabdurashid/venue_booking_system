import { create } from "zustand";

export const useAuthStore = create((set) => ({
    role: 'admin',
    username: '',
    password: '',
    error: '',
    token: null,

    setRole: (role) => set({ role }),
    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
    setError: (error) => set({ error }),
    setToken: (token) => set({ token }),
    logout: () => set({ token: null, username: '', password: '', role: 'admin', error: '' })
}))

export default useAuthStore