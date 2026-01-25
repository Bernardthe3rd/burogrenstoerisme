import { useEffect, useState } from 'react'
import { businessService, type Business } from '../services/businesses'
import './BusinessesPage.css'

export default function BusinessesPage() {
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)

    // State voor de Modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        category: 'Hotel',
        address: '',
        city: '',
        country: 'NL'
    })

    useEffect(() => {
        const fetchBusinesses = async () => {
            setLoading(true)
            const { data } = await businessService.getAll()
            if (data) setBusinesses(data)
            setLoading(false)
        }

        fetchBusinesses().catch(console.error)
    }, [])

    // Delete functie via de Service
    const handleDelete = async (id: string) => {
        if (!window.confirm('Weet je zeker dat je dit bedrijf wilt verwijderen?')) return

        const { error } = await businessService.delete(id)

        if (error) {
            alert('Fout bij verwijderen: ' + error.message)
        } else {
            // Update lokale state: filter het verwijderde item eruit
            setBusinesses(prev => prev.filter(b => b.id !== id))
        }
    }

    // Create functie via de Service
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return alert('Naam is verplicht')

        try {
            if (editingId) {
                // --- UPDATE MODUS ---
                const { data, error } = await businessService.update(editingId, formData)
                if (error) throw error

                // Update de lokale lijst: vervang het oude item door de nieuwe data
                setBusinesses(prev => prev.map(b => b.id === editingId ? data : b))
            } else {
                // --- CREATE MODUS ---
                const { data, error } = await businessService.create(formData)
                if (error) throw error

                setBusinesses(prev => [data, ...prev])
            }

            // Opruimen
            setIsModalOpen(false)
            setFormData({ name: '', category: 'Hotel', address: '', city: '', country: 'NL' })
            setEditingId(null)

        } catch (error) {
            const message = (error as { message: string }).message || "Onbekend fout"
            alert('Error: ' + message)
        }
    }


    const handleEdit = (business: Business) => {
        setFormData({
            name: business.name,
            category: business.category,
            address: business.address || "",
            city: business.city,
            country: business.country
        })
        setEditingId(business.id)
        setIsModalOpen(true)
    }

    const handleNew = () => {
        setFormData({ name: '', category: 'Hotel', address: '', city: '', country: 'NL' })
        setEditingId(null)
        setIsModalOpen(true)
    }

    return (
        <div className="container">
            <div className="admin-header">
                <h1>Dashboard Bedrijven</h1>
                <button className="add-btn" onClick={handleNew}>
                    + Nieuw Bedrijf
                </button>
            </div>

            {/* --- MODAL START --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingId ? "Bedrijf Bewerken" : "Nieuw Bedrijf"}</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Bedrijfsnaam</label>
                                <input
                                    className="modal-input"
                                    placeholder="Bijv. Tech Solutions B.V."
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Categorie</label>
                                <select
                                    className="modal-input"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="supermarkt">Supermarkt</option>
                                    <option value="tankstation">Tankstation</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="hotel">Hotel</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Adres</label>
                                <input
                                    className="modal-input"
                                    placeholder="Straatnaam 123"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    required // Maak hem verplicht in HTML zodat je niet per ongeluk leeg verstuurt
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Stad</label>
                                    <input
                                        className="modal-input"
                                        placeholder="Amsterdam"
                                        value={formData.city}
                                        onChange={e => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Land code</label>
                                    <input
                                        className="modal-input"
                                        placeholder="NL"
                                        value={formData.country}
                                        onChange={e => setFormData({...formData, country: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="cancel-btn"
                                >
                                    Annuleren
                                </button>
                                <button type="submit" className="add-btn">
                                    Opslaan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Laden...</p>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Naam</th>
                            <th>Categorie</th>
                            <th>Locatie</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {businesses.map((business) => (
                            <tr key={business.id}>
                                <td>
                                    <strong>{business.name}</strong>
                                </td>
                                <td>
                                    <span className={`badge ${business.category}`}>
                                    {business.category}
                                    </span>
                                </td>
                                <td>{business.city}, {business.country}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="edit-btn" onClick={() => handleEdit(business)}>✏️</button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(business.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}