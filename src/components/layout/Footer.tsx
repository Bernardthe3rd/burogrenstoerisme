import './Footer.css' // Maken we zo
import { Link } from 'react-router-dom'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="site-footer">
            <div className="footer-content container">
                <div className="footer-column">
                    <h3>🇩🇪 Buro Grenstoerisme 🇳🇱</h3>
                    <p>De brug tussen Nederlandse klanten en Duitse ondernemers.</p>
                </div>

                <div className="footer-column">
                    <h4>Navigatie</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Inloggen (Partners)</Link></li>
                        {/* Hier zou later een pagina "Over Ons" kunnen */}
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Juridisch</h4>
                    <ul>
                        {/* Maak deze pagina's later aan met simpele tekst */}
                        <li><span style={{color:'#888', cursor:'not-allowed'}}>Impressum</span></li>
                        <li><span style={{color:'#888', cursor:'not-allowed'}}>Privacy & Voorwaarden</span></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Contact</h4>
                    <p>📧 info@grenstoerisme.nl</p>
                    <p>📞 +31 6 12345678</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Buro Grenstoerisme. Alle rechten voorbehouden.</p>
            </div>
        </footer>
    )
}
