const UserRole = {
    ADMIN: 'admin',
    STUDENT: 'student',
    ADVERTISER: 'advertiser'
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];

export { UserRole };

export interface User {
    id: string
    email: string
    role: UserRole
    created_at: string
}

export interface Student extends User {
    commission_rate: number
    can_view_correspondence: boolean
    can_view_financials: boolean
}
