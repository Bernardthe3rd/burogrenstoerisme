import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/user'
import './Navbar.css'
import ButtonNav from "./ButtonNav"
import logo from "/favicon.ico" // Zorg dat dit pad klopt

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false) // State voor mobiel menu

    const handleLogout = async () => {
        await logout()
        setIsOpen(false) // Sluit menu na uitloggen
        navigate('/')
    }

    // Hulpfunctie om menu te sluiten na klikken op link (optioneel, wel fijn op mobiel)
    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            setIsOpen(false)
        }
    }

    return (
        <>
            {/* 1. Mobiele Header (Alleen zichtbaar op mobiel) */}
            <div className="mobile-header">
                <button
                    className="hamburger-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu openen"
                >
                    <img src={logo} alt="logo" />
                </button>
            </div>

            {/* 2. Overlay (Achtergrond die donker wordt) */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            {/* 3. De Sidebar zelf (Aangepast met 'open' class) */}
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="logo-img-wrapper">
                    <img src={logo} alt="logo" />
                    {/* Knopje om te sluiten binnen de sidebar (optioneel) */}
                    <button
                        className="close-sidebar-btn"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="sidebar-links" onClick={handleNavClick}>
                    <ButtonNav path="/" text="🏠 Home" />

                    {user?.role === UserRole.ADMIN && (
                        <>
                            <ButtonNav path="/admin" text="📊 Dashboard" />
                            <ButtonNav path="/admin/students" text="🎓 Studenten" />
                            <ButtonNav path="/admin/invoices" text="💶 Facturen" />
                            <ButtonNav path="/admin/banners" text="🖼️ Banners" />
                            <ButtonNav path="/admin/correspondence" text="✉️ Berichten" />
                            <ButtonNav path="/admin/businesses" text="📍 Bedrijven" />
                        </>
                    )}

                    {user?.role === UserRole.STUDENT && (
                        <ButtonNav path="/student" text="👥 Klanten" />
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
                        <div onClick={handleNavClick}>
                            <ButtonNav path="/login" text="Inloggen" />
                        </div>
                    )}
                </div>
            </nav>
        </>
    )
}
