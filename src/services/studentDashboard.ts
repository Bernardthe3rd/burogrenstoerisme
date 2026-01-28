import { supabase } from '../lib/supabase'

export interface StudentStats {
    totalCommission: number
    activeAdvertisers: number
    pendingCommission: number
}

export const studentDashboardService = {
    // 1. Haal het ID van de ingelogde student op
    async getMyStudentId() {
        const response = await supabase.auth.getUser()
        const user = response.data.user

        if (!user) return null

        const { data } = await supabase
            .from('students')
            .select('id')
            .eq('id', user.id)
            .single()

        return data?.id
    },

    // 2. Haal mijn adverteerders op
    async getMyAdvertisers(studentId: string) {
        return supabase
            .from('advertisers')
            .select('*')
            .eq('student_id', studentId)
            .order('company_name')
    },

    // 3. Haal facturen op van MIJN adverteerders
    async getMyInvoices(studentId: string) {
        return supabase
            .from('invoices')
            .select(`
                *,
                advertisers!inner (
                    company_name,
                    student_id
                )
            `)
            .eq('advertisers.student_id', studentId)
            .order('created_at', { ascending: false })
    },

    // 4. Bereken statistieken
    // We gebruiken hier een simpel object type i.p.v. any
    calculateStats(
        invoices: { amount: number; status: string }[],
        commissionRate: number
    ): StudentStats {
        let total = 0
        let pending = 0

        invoices.forEach((inv) => {
            const comm = (inv.amount * (commissionRate / 100))
            if (inv.status === 'paid') total += comm
            if (inv.status === 'sent' || inv.status === 'overdue') pending += comm
        })

        return {
            totalCommission: total,
            pendingCommission: pending,
            activeAdvertisers: 0
        }
    }
}
