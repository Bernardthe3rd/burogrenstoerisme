import GrensMap from '../components/map/GrensMap'
import './HomePage.css'

export default function HomePage() {
    return (
        <main className="container">
            <section className="home__upper-section">
                <h1>🇩🇪 BURO GRENSTOERISME 🇳🇱</h1>
                <p>Ontdek de beste winkels, restaurants en tankstations net over de grens.</p>
            </section>

            <ul className="home__categories-list">
                <li className="home__categories-item">
                    <h3>🛒 Supermarkten</h3>
                </li>

                <li className="home__categories-item">
                    <h3>⛽ Tankstations</h3>
                </li>

                <li className="home__categories-item">
                    <h3>🍽️ Restaurants</h3>
                </li>
            </ul>

            <section className="home__map-section">
                <GrensMap />
            </section>
        </main>
    )
}
