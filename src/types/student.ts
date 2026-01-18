export interface Student {
    id: string
    created_at: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
    commission_rate: number
    can_view_correspondence: boolean
    can_view_financials: boolean
    // Status kan handig zijn
    status?: 'active' | 'inactive'
}

// Voor het aanmaken (Insert) zijn ID en created_at niet nodig
export interface StudentInsert {
    first_name: string
    last_name: string
    email?: string | null
    phone?: string | null
    commission_rate?: number
    can_view_correspondence?: boolean
    can_view_financials?: boolean
}

// Voor het updaten is alles optioneel
export interface StudentUpdate extends Partial<StudentInsert> {}