import GrensMap from '../components/map/GrensMap'
import './HomePage.css'
import {useEffect, useMemo, useState} from "react";
import {type Business, businessService} from "../services/businesses.ts";

export default function HomePage() {
    // 1. Alleen state voor de ruwe data en de filter keuze
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([])
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // 2. Data ophalen (dit effect mag blijven)
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await businessService.getAll()
            if (data) {
                setAllBusinesses(data)
            }
        }
        fetchData()
    }, [])

    // 3. Derived State: Bereken de gefilterde lijst tijdens render
    // useMemo zorgt dat hij dit alleen opnieuw rekent als data of categorie verandert
    const filteredBusinesses = useMemo(() => {
        if (!activeCategory) return allBusinesses
        return allBusinesses.filter(b => b.category === activeCategory)
    }, [allBusinesses, activeCategory])

    // Helper toggle
    const toggleCategory = (category: string) => {
        setActiveCategory(prev => prev === category ? null : category)
    }

    return (
        <main className="container">
            <section className="home__upper-section">
                <h1>🇩🇪 BURO GRENSTOERISME 🇳🇱</h1>
                <p>Ontdek de beste winkels, restaurants en tankstations net over de grens.</p>
            </section>

            <ul className="home__categories-list">
                <li className={`home__categories-item ${activeCategory === 'supermarket' ? 'active' : ''}`} onClick={() => toggleCategory('supermarket')}>
                    <h3>🛒 Supermarkten</h3>
                </li>

                <li className={`home__categories-item ${activeCategory === 'gas_station' ? 'active' : ''}`}  onClick={() => toggleCategory('gas_station')}>
                    <h3>⛽ Tankstations</h3>
                </li>

                <li className={`home__categories-item ${activeCategory === 'restaurant' ? 'active' : ''}`} onClick={() => toggleCategory('restaurant')}>
                    <h3>🍽️ Restaurants</h3>
                </li>
            </ul>

            <section className="home__map-section">
                <GrensMap businesses={filteredBusinesses} />
            </section>
        </main>
    )
}
