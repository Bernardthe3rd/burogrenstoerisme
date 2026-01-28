import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { businessService, type Business } from '../services/businesses'
import './BusinessDetailPage.css'
import GrensMap from "../components/map/GrensMap.tsx";
import ButtonNav from "../components/layout/ButtonNav.tsx";

export default function BusinessDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [business, setBusiness] = useState<Business | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBusiness = async () => {
            if (id) {
                const { data } = await businessService.getById(id)
                setBusiness(data)
            }
            setLoading(false)
        }
        fetchBusiness().catch(console.error)
    }, [id])

    if (loading) return <div className="loading">Laden...</div>
    if (!business) return <div className="error">Bedrijf niet gevonden.</div>

    // Helper voor Google Maps link
    const openGoogleMaps = () => {
        // Zoek op adres of coördinaten
        const query = business.address
            ? `${business.address}, ${business.city}`
            : `${business.latitude},${business.longitude}`

        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`, '_blank')
    }

    // Default plaatje als er geen image_url is
    const bgImage = business.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000'

    return (
        <div className="container">
            {/* HEADER MET FOTO */}
            <div className="detail-header">
                <img src={bgImage} alt={business.name} className="detail-bg-image" />
                <div className="detail-header-content">
                    <h1 className="detail-title">{business.name}</h1>
                    <div className="detail-badges">
                        <span className="detail-badge">{business.category}</span>
                        {business.cuisine_type && (
                            <span className="detail-badge">🍽️ {business.cuisine_type}</span>
                        )}
                        <span className="detail-badge">📍 {business.city}</span>
                    </div>
                </div>
            </div>

            <div className="detail-content-grid">

                {/* LINKER KOLOM: TEKST */}
                <div className="detail-left">
                    <section className="detail-section">
                        <h2>Over {business.name}</h2>
                        <p className="detail-description">
                            {business.description || "Geen beschrijving beschikbaar voor dit bedrijf."}
                        </p>
                    </section>
                </div>

                {/* RECHTER KOLOM: INFO & KAART */}
                <div className="detail-right">
                    <div className="info-card">
                        <h3>📍 Contact & Locatie</h3>

                        <div className="info-row">
                            <span>🏠</span>
                            <span>{business.address}, {business.city}</span>
                        </div>

                        {business.phone && (
                            <div className="info-row">
                                <span>📞</span>
                                <a href={`tel:${business.phone}`} style={{color: 'inherit'}}>{business.phone}</a>
                            </div>
                        )}

                        {business.website && (
                            <div className="info-row">
                                <span>🌐</span>
                                <a href={business.website} target="_blank" rel="noreferrer" style={{color: '#2563eb'}}>Website bezoeken</a>
                            </div>
                        )}

                        {/* ACTIE KNOPPEN */}
                        <button className="action-btn btn-primary" onClick={openGoogleMaps}>
                            🚗 Navigeer hierheen
                        </button>
                    </div>

                    {/* MINI MAPJE */}
                    <div style={{marginTop: '20px', height: '250px', borderRadius: '12px', overflow: 'hidden'}}>
                        {/* We hergebruiken je GrensMap component, maar geven maar 1 bedrijf mee! */}
                        <GrensMap businesses={[business]} />
                    </div>
                </div>
            </div>

            <ul className="back-home-btn-wrap">
                <ButtonNav path="/" text="terug naar home"/>
            </ul>
        </div>
    )
}