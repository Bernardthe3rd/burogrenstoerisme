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
    }
}
