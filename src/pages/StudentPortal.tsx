import { useAuthStore } from '../store/authStore'

export default function StudentPortal() {
    const { user, logout } = useAuthStore()

    return (
        <div>
            <h1>Student Portal</h1>
            <p>Welkom, {user?.email}</p>
            <button onClick={logout}>Logout</button>
            <p>Hier komt: jouw klanten, correspondentie, commissies</p>
        </div>
    )
}
