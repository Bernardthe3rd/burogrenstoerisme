import GrensMap from '../components/map/GrensMap'
import './HomePage.css' // Importeer de CSS file

export default function HomePage() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>🇩🇪 Grensgebied Voordeel 🇳🇱</h1>
                <p>Ontdek de beste winkels, restaurants en tankstations net over de grens.</p>
            </header>

            <div className="map-section">
                <GrensMap />
            </div>

            <div className="category-grid">
                <div className="category-card">
                    <h3>🛒 Supermarkten</h3>
                </div>

                <div className="category-card">
                    <h3>⛽ Tankstations</h3>
                </div>

                <div className="category-card">
                    <h3>🍽️ Restaurants</h3>
                </div>
            </div>
        </div>
    )
}
