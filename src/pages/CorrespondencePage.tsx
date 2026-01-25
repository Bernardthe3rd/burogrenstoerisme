import { useEffect, useState, useCallback, useRef } from 'react'
import { correspondenceService } from '../services/correspondence'
import { advertiserService, type Advertiser } from '../services/advertisers'
import './CorrespondencePage.css'
import '../components/AdminDashboard.css'

interface CorrespondenceMessage {
    id: string
    created_at: string
    subject: string
    message: string
    advertisers: {
        company_name: string
    } | null
}

interface MessageForm {
    subject: string
    message: string
    advertiser_id: string
}

export default function CorrespondencePage() {
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<CorrespondenceMessage[]>([])
    const [advertisers, setAdvertisers] = useState<Advertiser[]>([])

    // Ref om bij te houden of de component actief is (voorkomt memory leaks en linter errors)
    const isMounted = useRef(true)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState<MessageForm>({
        subject: '',
        message: '',
        advertiser_id: ''
    })

    // Cleanup voor de mounted ref
    useEffect(() => {
        return () => { isMounted.current = false }
    }, [])

    const fetchData = useCallback(async () => {
        try {
            const [msgRes, advRes] = await Promise.all([
                correspondenceService.getAllAdmin(),
                advertiserService.getAll()
            ])

            // Check of component nog bestaat voordat we state updaten
            if (isMounted.current) {
                if (msgRes.data) setMessages(msgRes.data as unknown as CorrespondenceMessage[])
                if (advRes.data) setAdvertisers(advRes.data)
            }

        } catch (error) {
            console.error("Fout bij ophalen data", error)
        } finally {
            if (isMounted.current) {
                setLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchData().catch(console.error)
    }, [fetchData])

    const handleDelete = async (id: string) => {
        // FIX: window. toevoegen
        if (!window.confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) return

        const { error } = await correspondenceService.delete(id)
        if (error) {
            // FIX: window. toevoegen
            window.alert('Fout: ' + error.message)
        } else {
            setMessages(prev => prev.filter(m => m.id !== id))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // FIX: window. toevoegen
        if (!formData.advertiser_id) return window.alert('Kies een ontvanger (bedrijf)')
        if (!formData.subject) return window.alert('Onderwerp is verplicht')
        if (!formData.message) return window.alert('Bericht mag niet leeg zijn')

        setLoading(true)

        try {
            const { error } = await correspondenceService.create(formData)

            if (error) {
                setLoading(false)
                window.alert('Error: ' + error.message)
                return
            }

            await fetchData()
            setIsModalOpen(false)
            setFormData({ subject: '', message: '', advertiser_id: '' })

        } catch (error) {
            const msg = (error as {message: string}).message || 'Kon bericht niet versturen'
            window.alert('Error: ' + msg)
            setLoading(false)
        }
    }

    return (
        <div className="container correspondence-container">
            <div className="admin-header">
                <h1>Berichtencentrum</h1>
                <button
                    className="add-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Nieuw Bericht
                </button>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Nieuw Bericht Sturen</h2>
                        <form onSubmit={handleSubmit} className="modal-form">

                            <div className="form-group">
                                <label>Ontvanger (Bedrijf)</label>
                                <select
                                    className="modal-input"
                                    value={formData.advertiser_id}
                                    onChange={e => setFormData({...formData, advertiser_id: e.target.value})}
                                    required
                                >
                                    <option value="">Selecteer bedrijf...</option>
                                    {advertisers.map(adv => (
                                        <option key={adv.id} value={adv.id}>
                                            {adv.company_name} ({adv.contact_person})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Onderwerp</label>
                                <input
                                    className="modal-input"
                                    placeholder="Bijv. Factuur herinnering of Update"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Bericht</label>
                                <textarea
                                    className="modal-input msg-textarea"
                                    rows={6}
                                    placeholder="Typ hier je bericht voor de student..."
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    required
                                />
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
                                    Versturen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- TABEL --- */}
            {loading ? <p>Laden...</p> : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Ontvanger</th>
                            <th>Onderwerp</th>
                            <th style={{width: '40%'}}>Bericht Preview</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {messages.map((msg) => (
                            <tr key={msg.id}>
                                <td className="date-cell">
                                    {new Date(msg.created_at).toLocaleDateString('nl-NL')}
                                    <span className="time-label">
                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                </td>
                                <td className="recipient-cell">
                                    {msg.advertisers?.company_name || 'Onbekend'}
                                </td>
                                <td>{msg.subject}</td>
                                <td className="preview-cell" title={msg.message}>
                                    {msg.message}
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        title="Verwijderen"
                                        onClick={() => handleDelete(msg.id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={5} className="empty-state">
                                    Nog geen berichten verstuurd.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}