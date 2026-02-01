import { Link } from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <div className="container">
            <h1>404</h1>
            <h2>Oeps! Pagina niet gevonden.</h2>
            <p>
                De pagina die je zoekt bestaat niet of is verhuisd.
            </p>
            <Link to="/" className="view-btn">
                Terug naar de kaart
            </Link>
        </div>
    )
}
