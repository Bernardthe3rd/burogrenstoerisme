import { useEffect, useState } from 'react'
import { advertiserService, type Advertiser } from '../services/advertisers'
import { profileService, type Profile } from '../services/profiles'
import './AdvertisersPage.css'
import './BusinessesPage.css'

export default function AdvertisersPage() {
    const [loading, setLoading] = useState(true)
    const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
    const [students, setStudents] = useState<Profile[]>([])

    // Modal & Edit State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null) // <--- Toegevoegd voor bewerken

    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        acquired_by: ''
    })

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const [advRes, studRes] = await Promise.all([
                    advertiserService.getAll(),
                    profileService.getAllStudents()
                ])

                if (advRes.data) setAdvertisers(advRes.data as unknown as Advertiser[])
                if (studRes.data) setStudents(studRes.data as Profile[])

            } catch (error) {
                console.error("Error loading data", error)
            } finally {
                setLoading(false)
            }
        }
        loadData().catch(console.error)
    }, [refreshKey])

    // Functie voor opslaan (Aanmaken óf Bewerken)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingId) {
                // Update bestaande adverteerder
                const { error } = await advertiserService.update(editingId, formData)
                if (error) throw error
            } else {
                // Maak nieuwe adverteerder
                const { error } = await advertiserService.create(formData)
                if (error) throw error
            }

            closeModal()
            setRefreshKey(old => old + 1)
        } catch (error) {
            const msg = (error as {message: string}).message || 'Kon gegevens niet opslaan'
            window.alert('Fout: ' + msg)
        }
    }

    // Open modal voor bewerken
    const handleEdit = (adv: Advertiser) => {
        setFormData({
            company_name: adv.company_name || '',
            contact_person: adv.contact_person || '',
            email: adv.email || '',
            phone: adv.phone || '',
            // Zorg dat de dropdown de juiste student pakt (id)
            acquired_by: adv.acquired_by || ''
        })
        setEditingId(adv.id)
        setIsModalOpen(true)
    }

    // Open modal voor nieuw
    const handleNew = () => {
        setFormData({
            company_name: '', contact_person: '', email: '',
            phone: '', acquired_by: ''
        })
        setEditingId(null)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Weet je zeker dat je deze adverteerder wilt verwijderen?')) return
        await advertiserService.delete(id)
        setRefreshKey(old => old + 1)
    }

    const closeModal = () => setIsModalOpen(false)

    return (
        <div className="container">
            <div className="business-header">
                <h1>Adverteerders Beheer</h1>
                <button className="add-btn" onClick={handleNew}>
                    + Nieuwe Adverteerder
                </button>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {/* Dynamische titel */}
                        <h2>{editingId ? "Adverteerder Bewerken" : "Nieuwe Adverteerder"}</h2>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group commission-box">
                                <label className="commission-label">Aangebracht door (Student)</label>
                                <select
                                    className="modal-input"
                                    value={formData.acquired_by}
                                    onChange={e => setFormData({...formData, acquired_by: e.target.value})}
                                >
                                    <option value="">-- Geen / Directe verkoop --</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Bedrijfsnaam</label>
                                <input className="modal-input" required
                                       value={formData.company_name}
                                       onChange={e => setFormData({...formData, company_name: e.target.value})}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contactpersoon</label>
                                    <input className="modal-input" required
                                           value={formData.contact_person}
                                           onChange={e => setFormData({...formData, contact_person: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telefoon</label>
                                    <input className="modal-input" required
                                           value={formData.phone}
                                           onChange={e => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input className="modal-input" type="email" required
                                       value={formData.email}
                                       onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="cancel-btn">Annuleren</button>
                                <button type="submit" className="add-btn">Opslaan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABEL */}
            {loading ? <p>Laden...</p> : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            {/* 'Stad' is hier weggehaald, nu zijn er 5 headers voor 5 kolommen! */}
                            <th>Bedrijf</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Aangebracht Door</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {advertisers.map(adv => (
                            <tr key={adv.id}>
                                <td className="company-cell"><strong>{adv.company_name}</strong></td>
                                <td>
                                    {adv.contact_person}
                                    <small className="contact-email-small" style={{display: 'block', color: '#666'}}>{adv.email}</small>
                                </td>
                                <td>
                                    <span className={`status-badge ${adv.status || 'active'}`}>
                                            {adv.status || 'Actief'}
                                    </span>
                                </td>
                                <td className={`acquired-cell ${adv.profiles ? 'is-student' : 'is-direct'}`}>
                                    {adv.profiles ? adv.profiles.email : 'Direct'}
                                </td>
                                <td>
                                    {/* Edit knop toegevoegd naast de delete knop */}
                                    <div className="action-buttons" style={{display: 'flex', gap: '8px'}}>
                                        <button className="edit-btn" onClick={() => handleEdit(adv)}>✏️</button>
                                        <button className="delete-btn" onClick={() => handleDelete(adv.id)}>🗑️</button>
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