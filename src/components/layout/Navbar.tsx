import { useNavigate} from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/user'
import './Navbar.css'
import ButtonNav from "./ButtonNav.tsx";

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }


    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h4>🇩🇪 Grenstoerisme</h4>
            </div>
            <div className="sidebar-links">
                <ButtonNav path="/" text="🏠 Home" />

                {/* Admin Links */}
                {user?.role === UserRole.ADMIN && (
                    <>
                        <ButtonNav path="/admin" text="📊 Dashboard" />
                        <ButtonNav path="/admin/students" text="🎓 Studenten" />
                        <ButtonNav path="/admin/invoices" text=" 💶 Facturen" />
                        <ButtonNav path="/admin/banners" text="🖼️ Banners" />
                        <ButtonNav path="/admin/correspondence" text="✉️ Berichten" />
                        <ButtonNav path="/admin/businesses" text="📍️ Bedrijven" />
                    </>
                )}

                {/* Student Links */}
                {(user?.role === UserRole.STUDENT || user?.role === UserRole.ADMIN) && (
                    <>
                        <ButtonNav path="/student" text="👥 Klanten" />
                    </>
                )}
            </div>

            <div className="sidebar-footer">
                {user ? (
                    <>
                        <div className="user-info">{user.email}</div>
                        <button onClick={handleLogout} className="logout-btn">
                            Uitloggen
                        </button>
                    </>
                ) : (
                    <ButtonNav path="/login" text="Inloggen" />
                )}
            </div>
        </nav>
    )
}
