import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

export default function AdminDashboard() {
    const navigate = useNavigate()

    return (
        <div className="container">
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <div className="dashboard-grid">

                {/* KAART 1: Bedrijven */}
                <div
                    className="dashboard-card"
                    onClick={() => navigate('/admin/businesses')}
                >
                    <div className="card-icon">📍</div>
                    <h3>Locaties & Kaart</h3>
                    <p>Beheer restaurants, tankstations en winkels voor op de kaart.</p>
                </div>

                {/* KAART 2: Adverteerders */}
                <div
                    className="dashboard-card"
                    onClick={() => navigate('/admin/advertisers')}
                >
                    <div className="card-icon">🏢</div>
                    <h3>Adverteerders</h3>
                    <p>Beheer betalende klanten en koppel ze aan studenten.</p>
                </div>

                {/* KAART 3: Studenten */}
                <div
                    className="dashboard-card"
                    onClick={() => navigate('/admin/students')}
                >
                    <div className="card-icon">🎓</div>
                    <h3>Studenten Team</h3>
                    <p>Overzicht van alle verkopers en hun prestaties.</p>
                </div>

                {/* KAART 4: Correspondentie */}
                <div
                    className="dashboard-card"
                    onClick={() => navigate('/admin/correspondence')}
                >
                    <div className="card-icon">✉️</div>
                    <h3>Berichtencentrum</h3>
                    <p>Stuur updates en berichten naar je adverteerders.</p>
                </div>

            </div>
        </div>
    )
}
