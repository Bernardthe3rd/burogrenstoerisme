import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

// --- TYPES ---
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

// We definiëren handmatig wat we terugkrijgen van de join query
export interface InvoiceWithAdvertiser extends Invoice {
    advertisers: {
        company_name: string
    } | null
}

// --- SERVICE ---
export const invoiceService = {
    // 1. Haal alle facturen op
    async getAll() {
        const { data, error } = await supabase
            .from('invoices')
            .select('*, advertisers(company_name)') // Dit is de magic join string
            .order('created_at', { ascending: false })

        // Type casting forceren we hier veilig
        const typedData = data as unknown as InvoiceWithAdvertiser[] | null
        return {  typedData, error }
    },

    // 2. Haal één factuur op
    async getById(id: string) {
        const { data, error } = await supabase
            .from('invoices')
            .select('*, advertisers(company_name)')
            .eq('id', id)
            .single()

        const typedData = data as unknown as InvoiceWithAdvertiser | null
        return {  typedData, error }
    },

    // 3. Aanmaken
    async create(invoice: InvoiceInsert) {
        return supabase
            .from('invoices')
            .insert([invoice])
            .select()
            .single()
    },

    // 4. Updaten
    async update(id: string, updates: InvoiceUpdate) {
        return supabase
            .from('invoices')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    },

    // 5. Verwijderen
    async delete(id: string) {
        return supabase
            .from('invoices')
            .delete()
            .eq('id', id)
    }
}
