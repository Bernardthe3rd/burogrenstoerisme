import { supabase } from '../lib/supabase'

export interface Profile {
    id: string
    email: string
    role: string
}

export const profileService = {
    // Haal alle profielen op die de rol 'student' hebben
    async getAllStudents() {
        return supabase
            .from('profiles')
            .select('id, email')
            .eq('role', 'student')
            .order('email', {ascending: true});
    }
}
