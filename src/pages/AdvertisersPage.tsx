import { useEffect, useState } from 'react'
import { advertiserService, type Advertiser } from '../services/advertisers'
import { profileService, type Profile } from '../services/profiles'
import './AdvertisersPage.css'
import './BusinessesPage.css'

export default function AdvertisersPage() {
    const [loading, setLoading] = useState(true)
    const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
    const [students, setStudents] = useState<Profile[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { error } = await advertiserService.create(formData)
            if (error) throw error

            setIsModalOpen(false)
            setFormData({
                company_name: '', contact_person: '', email: '',
                phone: '', acquired_by: ''
            })
            setRefreshKey(old => old + 1)
        } catch (error) {
            const msg = (error as {message: string}).message || 'Kon bericht niet versturen'
            window.alert('Fout: ' + msg)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Weet je het zeker?')) return
        await advertiserService.delete(id)
        setRefreshKey(old => old + 1)
    }

    return (
        <div className="container">
            <div className="admin-header">
                <h1>Adverteerders Beheer</h1>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                    + Nieuwe Adverteerder
                </button>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Nieuwe Klant Toevoegen</h2>
                        <form onSubmit={handleSubmit} className="modal-form">

                            {/* --- COMMISSIE BLOCK (Met CSS classes) --- */}
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
                                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Annuleren</button>
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
                            <th>Bedrijf</th>
                            <th>Stad</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Aangebracht Door</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {advertisers.map(adv => (
                            <tr key={adv.id}>
                                <td className="company-cell">{adv.company_name}</td>
                                <td>
                                    {adv.contact_person}
                                    <small className="contact-email-small">{adv.email}</small>
                                </td>
                                <td>
                                    {/* Deze class komt waarschijnlijk uit BusinessesPage.css of global */}
                                    <span className={`status-badge ${adv.status}`}>
                                            {adv.status}
                                        </span>
                                </td>
                                {/* Dynamische class op basis van of er een profiel is */}
                                <td className={`acquired-cell ${adv.profiles ? 'is-student' : 'is-direct'}`}>
                                    {adv.profiles ? adv.profiles.email : 'Direct'}
                                </td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDelete(adv.id)}>🗑️</button>
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
