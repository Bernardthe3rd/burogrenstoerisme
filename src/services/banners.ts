import { supabase } from '../lib/supabase'

export interface Banner {
    id: string
    created_at: string
    title: string
    image_url: string
    link_url?: string | null
    is_active: boolean
    clicks: number
}

export const bannerService = {
    // 1. Haal alle banners op (voor Admin beheer)
    async getAllAdmin() {
        return supabase
            .from('banners')
            .select('*')
            .order('created_at', {ascending: false});
    },

    // 2. Haal alleen actieve banners op (voor Homepage)
    async getActive() {
        return supabase
            .from('banners')
            .select('*')
            .eq('is_active', true)
            .order('created_at', {ascending: false});
    },

    // 3. Upload plaatje naar Storage
    async uploadImage(file: File) {
        // Maak een unieke bestandsnaam: timestamp-bestandsnaam
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`

        const { error } = await supabase.storage
            .from('banners')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) throw error

        // Haal de publieke URL op
        const {  data } = supabase.storage
            .from('banners')
            .getPublicUrl(fileName)

        return data.publicUrl
    },

    // 4. Maak banner record in DB
    async create(title: string, link_url: string | null, file: File | null, manualUrl: string = '') {
        // Stap A: Upload plaatje
        let finalImageUrl = manualUrl

        if (file) {
            finalImageUrl = await this.uploadImage(file)
        }

        if (!finalImageUrl) {
            throw new Error("Kies een afbeelding of vul een afbeeldings-URL in")
        }

        // Stap B: Save data
        return supabase
            .from('banners')
            .insert([{
                title,
                link_url: link_url || null,
                image_url: finalImageUrl,
                is_active: true
            }])
            .select()
            .single();
    },

    // 5. Toggle status (Aan/Uit)
    async toggleActive(id: string, currentState: boolean) {
        return supabase
            .from('banners')
            .update({is_active: !currentState})
            .eq('id', id);
    },

    // 6. Verwijderen
    async delete(id: string, imageUrl: string) {
        // Probeer eerst plaatje te verwijderen (netjes opruimen)
        const fileName = imageUrl.split('/').pop() // Pak de bestandsnaam uit de URL
        if (fileName) {
            await supabase.storage.from('banners').remove([fileName])
        }

        // Dan record verwijderen
        return supabase
            .from('banners')
            .delete()
            .eq('id', id);
    },

    // 7. Klik tellen (voor analytics)
    async trackClick(id: string) {
        // We gebruiken een database functie (RPC) of simpel increment
        // Voor nu simpel ophalen en updaten (RPC is beter voor concurrency, maar dit werkt voor MVP)
        const { data } = await supabase.from('banners').select('clicks').eq('id', id).single()
        if (data) {
            await supabase.from('banners').update({ clicks: data.clicks + 1 }).eq('id', id)
        }
    }
}
