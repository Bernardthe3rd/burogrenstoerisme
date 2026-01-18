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