import { supabase } from '../lib/supabase'
import type { UserRole } from '../types/user'

export const authService = {
    // Login
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    // Logout
    async signOut() {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Haal huidige user + profiel op
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        return profile
    },

    // Check of user een specifieke rol heeft
    async hasRole(role: UserRole) {
        const profile = await this.getCurrentUser()
        // FIX 3: Optional chaining toevoegen voor veiligheid
        return profile?.role === role
    },

    // Registreer nieuwe user (alleen voor admins)
    async signUp(email: string, password: string, role: UserRole) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error || !data.user) return { data: null, error }

        // Maak profiel aan
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                email,
                role,
            })

        return { data, error: profileError }
    }
}