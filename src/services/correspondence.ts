import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

export type Correspondence = Database['public']['Tables']['correspondence']['Row']

export interface CorrespondenceWithAdvertiser extends Correspondence {
    advertisers: {
        company_name: string
    } | null
}

export const correspondenceService = {
    async getMyMessages() {
        const { data, error } = await supabase
            .from('correspondence')
            .select(`
                *,
                advertisers (
                    company_name
                )
            `)
            .order('created_at', { ascending: false })

        // Type casting
        const typedData = data as unknown as CorrespondenceWithAdvertiser[] | null
        return {  typedData, error }
    },

    // Haal ALLE berichten op (voor admin)
    async getAllAdmin() {
        const { data, error } = await supabase
            .from('correspondence')
            .select(`
                *,
                advertisers (
                    company_name
                ),
                profiles (
                    email
                )
            `)
            .order('created_at', { ascending: false })

        return {  data, error }
    },

    // Nieuw bericht maken
    async create(message: { subject: string; message: string; advertiser_id: string }) {
        // We moeten ook 'created_by' invullen met de huidige user ID
        const response = await supabase.auth.getUser()
        const user = response.data.user

        return supabase
            .from('correspondence')
            .insert([{
                ...message,
                created_by: user?.id
            }])
            .select()
            .single();
    },

    // Verwijderen (optioneel, maar handig)
    async delete(id: string) {
        return supabase
            .from('correspondence')
            .delete()
            .eq('id', id);
    }
}
