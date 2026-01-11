import { create } from 'zustand'
import type { User, UserRole } from '../types/user'
import { authService } from '../services/auth'

interface AuthState {
    user: User | null
    loading: boolean
    setUser: (user: User | null) => void
    loadUser: () => Promise<void>
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user, loading: false }),

    loadUser: async () => {
        set({ loading: true })
        const userData = await authService.getCurrentUser()

        if (userData) {
            const user: User = {
                ...userData,
                role: userData.role as UserRole,
                created_at: userData.created_at || new Date().toISOString()
            }
            set({ user, loading: false })
        } else {
            set({ user: null, loading: false })
        }
    },

    logout: async () => {
        await authService.signOut()
        set({ user: null })
    },
}))
