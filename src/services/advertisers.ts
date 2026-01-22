import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

export type Advertiser = Database['public']['Tables']['advertisers']['Row']

export const advertiserService = {
    async getAll() {
        const { data, error } = await supabase
            .from('advertisers')
            .select('*')
            .order('company_name', { ascending: true })
        return { data, error }
    }
}
