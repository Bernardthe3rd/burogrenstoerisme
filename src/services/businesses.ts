import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

// Type voor het LEZEN van data (wat je uit de DB krijgt)
export type Business = Database['public']['Tables']['businesses']['Row']

// Type voor het TOEVOEGEN van data (hierin zijn nullable velden optioneel!)
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert']

// Type voor het UPDATEN van data
export type BusinessUpdate = Database['public']['Tables']['businesses']['Update']

export const businessService = {
    // 1. Haal alle bedrijven op
    async getAll() {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .order('created_at', { ascending: false })

        return { data, error }
    },

    // 2. Haal één bedrijf op
    async getById(id: string) {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq("id", id)
            .single()

        return { data, error }
    },

    // 3. Filter op categorie
    async getByCategory(category: string) {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('category', category)

        return { data, error }
    },

    // 4. Maak nieuw bedrijf aan
    // We gebruiken hier BusinessInsert zodat je niet álle velden hoeft in te vullen
    async create(business: BusinessInsert) {
        return supabase
            .from('businesses')
            .insert([business])
            .select()
            .single()
    },

    // 5. Update een bedrijf
    async update(id: string, updates: BusinessUpdate) {
        return supabase
            .from('businesses')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    },

    // 6. Verwijder een bedrijf
    async delete(id: string) {
        return supabase
            .from('businesses')
            .delete()
            .eq('id', id)
    }
}
