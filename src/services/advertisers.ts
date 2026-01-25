import { supabase } from '../lib/supabase'

export interface Advertiser {
    id: string
    created_at: string
    company_name: string
    contact_person: string
    email: string
    phone: string
    status: 'active' | 'pending' | 'suspended'
    acquired_by?: string // Het ID van de student
    // De geneste data uit de profiles tabel
    profiles?: {
        email: string
    } | null
}

export interface CreateAdvertiserData {
    company_name: string
    contact_person: string
    email: string
    phone: string
    acquired_by?: string // <--- Dit veld sturen we mee bij aanmaken
}

export const advertiserService = {
    async getAll() {
        return supabase
            .from('advertisers')
            // We joinen met profiles via de kolom acquired_by en halen alleen email op
            .select('*, profiles:acquired_by(email)')
            .order('created_at', {ascending: false});
    },

    async create(CreateAdvertiserData: CreateAdvertiserData) {
        return supabase
            .from('advertisers')
            .insert(CreateAdvertiserData)
            .select();
    },

    async update(id: string, updates: Partial<CreateAdvertiserData>) {
        return supabase
            .from('advertisers')
            .update(updates)
            .eq('id', id);
    },

    async delete(id: string) {
        return supabase
            .from('advertisers')
            .delete()
            .eq('id', id);
    }
}
