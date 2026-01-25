import { useEffect, useMemo, useState } from "react"
import GrensMap from '../components/map/GrensMap'
import { businessService, type Business } from "../services/businesses.ts"
import './HomePage.css'
import {Link} from "react-router-dom";

// 1. CONFIGURATIE: Vertalingen en Iconen
// Hier koppel je de database-waarde aan een mooi label + icoon
const CATEGORY_CONFIG: Record<string, { label: string, icon: string }> = {
    restaurant:  { label: 'Restaurants',  icon: '🍽️' },
    supermarket: { label: 'Supermarkten', icon: '🛒' },
    gas_station: { label: 'Tankstations', icon: '⛽' },
    shop:        { label: 'Winkels',      icon: '🛍️' },
    drugstore:   { label: 'Drogisterijen',icon: '💊' },
    // Voeg hier nieuwe toe indien nodig. Onbekende categorieën krijgen een default icoon.
}

export default function HomePage() {
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([])

    // Filters
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [activeCuisine, setActiveCuisine] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await businessService.getAll()
            if (data) setAllBusinesses(data)
        }
        fetchData()
    }, [])

    // --- MAGIE 1: DYNAMISCHE HOOFD CATEGORIEËN ---
    const availableCategories = useMemo(() => {
        // Haal alle categorieën op uit de geladen bedrijven
        const cats = allBusinesses.map(b => b.category).filter(Boolean)
        // Maak uniek en sorteer
        return Array.from(new Set(cats)).sort()
    }, [allBusinesses])

    // --- MAGIE 2: DYNAMISCHE KEUKENS (SUB) ---
    const availableCuisines = useMemo(() => {
        // Alleen berekenen als we op 'restaurant' zitten (of als je dat voor alles wil, pas filter aan)
        if (activeCategory !== 'restaurant') return []

        const restaurants = allBusinesses.filter(b => b.category === 'restaurant')
        const types = restaurants.map(r => r.cuisine_type).filter((t): t is string => !!t)
        return Array.from(new Set(types)).sort()
    }, [allBusinesses, activeCategory]) // Nu ook afhankelijk van activeCategory

    // Filter Logica
    const filteredBusinesses = useMemo(() => {
        return allBusinesses.filter(b => {
            // 1. Categorie
            if (activeCategory && b.category !== activeCategory) return false

            // 2. Keuken (alleen bij restaurants)
            if (activeCategory === 'restaurant' && activeCuisine) {
                if (b.cuisine_type?.toLowerCase() !== activeCuisine.toLowerCase()) return false
            }

            // 3. Zoeken
            if (searchTerm) {
                const term = searchTerm.toLowerCase()
                const matchesName = b.name.toLowerCase().includes(term)
                const matchesCity = b.city.toLowerCase().includes(term)
                const matchesCuisine = b.cuisine_type?.toLowerCase().includes(term)
                if (!matchesName && !matchesCity && !matchesCuisine) return false
            }
            return true
        })
    }, [allBusinesses, activeCategory, activeCuisine, searchTerm])

    // Handlers
    const handleCategoryClick = (cat: string) => {
        if (activeCategory === cat) {
            setActiveCategory(null)
            setActiveCuisine(null)
        } else {
            setActiveCategory(cat)
            setActiveCuisine(null)
        }
    }

    const handleCuisineClick = (cuisine: string) => {
        setActiveCuisine(prev => prev === cuisine ? null : cuisine)
    }

    // Helper om label/icoon op te halen (ook voor onbekende categorieën)
    const getCategoryDisplay = (catKey: string) => {
        const config = CATEGORY_CONFIG[catKey]
        if (config) return config

        // Fallback voor als je een nieuwe categorie in de DB zet die nog niet in de config staat
        return {
            label: catKey.charAt(0).toUpperCase() + catKey.slice(1).replace('_', ' '),
            icon: '📍'
        }
    }

    return (
        <main className="container home-container">
            <section className="home__upper-section">
                <h1>🇩🇪 BURO GRENSTOERISME 🇳🇱</h1>
                <p>Ontdek de beste winkels, restaurants en tankstations net over de grens.</p>

                <div className="home__search-wrapper">
                    <input
                        type="text"
                        placeholder="🔍 Zoek op naam, stad of keuken..."
                        className="home__search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </section>

            {/* --- DYNAMISCHE CATEGORIE LIJST --- */}
            <ul className="home__categories-list">
                {availableCategories.map(catKey => {
                    const { label, icon } = getCategoryDisplay(catKey)
                    return (
                        <li
                            key={catKey}
                            className={`home__categories-item ${activeCategory === catKey ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(catKey)}
                        >
                            <h3>{icon} {label}</h3>
                        </li>
                    )
                })}
            </ul>

            {/* --- DYNAMISCHE SUB CATEGORIEËN (Keukens) --- */}
            {activeCategory === 'restaurant' && availableCuisines.length > 0 && (
                <div className="home__sub-categories">
                    {availableCuisines.map(cuisine => (
                        <button
                            key={cuisine}
                            className={`sub-cat-pill ${activeCuisine === cuisine ? 'active' : ''}`}
                            onClick={() => handleCuisineClick(cuisine)}
                        >
                            {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Melding als er geen keukens zijn */}
            {activeCategory === 'restaurant' && availableCuisines.length === 0 && allBusinesses.length > 0 && (
                <p className="home__results-count" style={{fontStyle: 'italic', fontSize: '0.9em'}}>
                    Tip: Voeg 'cuisine_type' toe aan je restaurants in de database om hier te filteren.
                </p>
            )}

            {/* Resultaten Teller */}
            <div className="home__results-count">
                {filteredBusinesses.length} resultaten gevonden
                {(activeCategory || searchTerm) && (
                    <button
                        className="reset-link"
                        onClick={() => {
                            setActiveCategory(null)
                            setActiveCuisine(null)
                            setSearchTerm("")
                        }}
                    >
                        Alles wissen
                    </button>
                )}
            </div>

            <section className="home__map-section">
                <GrensMap businesses={filteredBusinesses} />
            </section>

            {/* --- NIEUW: LIJSTWEERGAVE --- */}
            <section className="home__business-list">
                <h2 style={{marginBottom: '20px', color: '#334155'}}>
                    Resultatenlijst ({filteredBusinesses.length})
                </h2>

                {filteredBusinesses.length === 0 ? (
                    <p style={{textAlign:'center', color: '#64748b', fontStyle:'italic'}}>
                        Geen resultaten gevonden voor je zoekopdracht.
                    </p>
                ) : (
                    <div className="home__business-grid">
                        {filteredBusinesses.map(business => (
                            <div key={business.id} className="business-card">
                                <h3>{business.name}</h3>

                                <span className="business-category-badge">
                                    {CATEGORY_CONFIG[business.category]?.icon || '📍'}
                                    {' '}
                                    {business.cuisine_type ? business.cuisine_type : CATEGORY_CONFIG[business.category]?.label || business.category}
                                </span>

                                <div className="business-info">
                                    <p>📍 {business.address ? `${business.address}, ` : ''}{business.city}</p>

                                    {/*/!* Toon omschrijving (ingekort) of fallback *!/*/}
                                    {/*{business.description && (*/}
                                    {/*    <p style={{fontSize: '0.9em', color:'#666', marginTop:'10px'}}>*/}
                                    {/*        {business.description.length > 80*/}
                                    {/*            ? business.description.substring(0, 80) + '...'*/}
                                    {/*            : business.description}*/}
                                    {/*    </p>*/}
                                    {/*)}*/}
                                </div>

                                <div className="business-actions">
                                    <Link to={`/business/${business.id}`} className="view-btn">
                                        Bekijk Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
