import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

// Handige type shortcut
export type Business = Database['public']['Tables']['businesses']['Row']

export const businessService = {
    // Haal alle bedrijven op
    async getAll() {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')

        return { data, error }
    },

    async getById(id: string) {
        const { data, error } = await supabase
        .from('businesses')
        .select('*')
            .eq("id", id)
            .single()
        return { data, error }
    },

    // (Optioneel) Filter op categorie
    async getByCategory(category: string) {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('category', category)

        return { data, error }
    }
}
