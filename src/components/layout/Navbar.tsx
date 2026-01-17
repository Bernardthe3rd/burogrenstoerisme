import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/user'
import './Navbar.css'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const isActive = (path: string) => location.pathname === path ? 'nav-link active' : 'nav-link'

    return (
        <nav className="sidebar">
            <Link to="/" className="sidebar-brand">
                <span>🇩🇪 Grensgebied</span>
            </Link>

            <div className="sidebar-links">
                <Link to="/" className={isActive('/')}>
                    🏠 Home
                </Link>

                {/* Admin Links */}
                {user?.role === UserRole.ADMIN && (
                    <>
                        <div style={{ margin: '15px 0 5px 10px', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Admin</div>
                        <Link to="/admin" className={isActive('/admin')}>
                            📊 Dashboard
                        </Link>
                        <Link to="/admin/students" className={isActive('/admin/students')}>
                            🎓 Studenten
                        </Link>
                        <Link to="/admin/invoices" className={isActive('/admin/invoices')}>
                            💶 Facturen
                        </Link>
                    </>
                )}

                {/* Student Links */}
                {(user?.role === UserRole.STUDENT || user?.role === UserRole.ADMIN) && (
                    <>
                        <div style={{ margin: '15px 0 5px 10px', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Promotie</div>
                        <Link to="/student" className={isActive('/student')}>
                            👥 Mijn Klanten
                        </Link>
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
                    <Link to="/login" className="login-btn">
                        Inloggen
                    </Link>
                )}
            </div>
        </nav>
    )
}
