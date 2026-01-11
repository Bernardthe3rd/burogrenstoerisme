import { useAuthStore } from '../store/authStore'

export default function AdminDashboard() {
    const { user, logout } = useAuthStore()

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welkom, {user?.email}</p>
            <button onClick={logout}>Logout</button>
            <p>Hier komt: adverteerders, studenten, facturatie, correspondentie</p>
        </div>
    )
}
