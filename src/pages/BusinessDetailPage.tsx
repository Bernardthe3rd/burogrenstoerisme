import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { businessService, type Business } from '../services/businesses'
import './BusinessDetailPage.css'

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
        fetchBusiness()
    }, [id])

    if (loading) return <div className="loading">Laden...</div>
    if (!business) return <div className="error">Bedrijf niet gevonden.</div>

    return (
        <div className="container">
            <Link to="/" className="back-link">← Terug naar kaart</Link>

            <div className="detail-header">
                <h1>{business.name}</h1>
                <span className="badge">{business.category}</span>
                {business.cuisine_type && <span className="badge cuisine">{business.cuisine_type}</span>}
            </div>

            <div className="detail-grid">
                <div className="detail-main">
                    {/* Hier komt later een foto slider */}
                    <div className="placeholder-image">
                        Afbeelding van {business.name}
                    </div>

                    <div className="description">
                        <h3>Over {business.name}</h3>
                        <p>Hier komt de beschrijving uit de database (kolom description toevoegen later).</p>
                        <p>Welkom bij {business.name} in {business.city}.</p>
                    </div>
                </div>

                <div className="detail-sidebar">
                    <div className="info-card">
                        <h3>📍 Adres</h3>
                        <p>{business.address}</p>
                        <p>{business.city}, {business.country}</p>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="maps-link"
                        >
                            Routebeschrijving ↗
                        </a>
                    </div>

                    <div className="info-card">
                        <h3>📞 Contact</h3>
                        {business.phone ? <p>{business.phone}</p> : <p className="unknown">Geen telefoonnummer</p>}
                        {business.website && (
                            <a href={business.website} target="_blank" rel="noreferrer" className="website-link">
                                Bezoek website
                            </a>
                        )}
                    </div>

                    {/* Hier komt later de reserveringsmodule */}
                    {business.category === 'restaurant' && (
                        <button className="reserve-btn">
                            📅 Tafel Reserveren (Binnenkort)
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}