import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

// --- TYPES ---
// We gebruiken de database types direct zodat het altijd klopt met Supabase
export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

// --- SERVICE ---
export const studentService = {
    // 1. Alle studenten ophalen
    async getAll() {
        // We casten hier niet met 'as', we laten TypeScript zelf het type inferren
        const { data, error } = await supabase
            .from('students')
            .select('*')
            // Als je kolom 'last_name' nog niet bestaat, pas dit dan aan naar 'created_at'
            .order('last_name', { ascending: false })

        return { data, error }
    },

    // 2. Eén student ophalen
    async getById(id: string) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single()

        return { data, error }
    },

    // 3. Nieuwe student aanmaken
    async create(student: StudentInsert) {
        return supabase
            .from('students')
            .insert([student]) // Let op de array haken []
            .select()
            .single()
    },

    // 4. Student updaten
    async update(id: string, updates: StudentUpdate) {
        return supabase
            .from('students')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    },

    // 5. Student verwijderen
    async delete(id: string) {
        return supabase
            .from('students')
            .delete()
            .eq('id', id)
    }
}
