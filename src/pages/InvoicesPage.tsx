import { useEffect, useState } from 'react'
import { invoiceService, type InvoiceWithAdvertiser, type InvoiceInsert } from '../services/invoices'
import { advertiserService, type Advertiser } from '../services/advertisers'
import '../components/AdminDashboard.css'

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<InvoiceWithAdvertiser[]>([])
    const [advertisers, setAdvertisers] = useState<Advertiser[]>([])
    const [loading, setLoading] = useState(true)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState<InvoiceInsert>({
        invoice_number: '',
        amount: 0,
        status: 'draft',
        advertiser_id: '', // Moet geselecteerd worden
        due_date: new Date().toISOString().split('T')[0] // Vandaag als default
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        // We halen beide lijsten parallel op
        const [invRes, advRes] = await Promise.all([
            invoiceService.getAll(),
            advertiserService.getAll()
        ])

        if (invRes.data) setInvoices(invRes.data)
        if (advRes.data) setAdvertisers(advRes.data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Weet je zeker dat je deze factuur wilt verwijderen?')) return
        const { error } = await invoiceService.delete(id)
        if (!error) setInvoices(prev => prev.filter(i => i.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.invoice_number) return alert('Factuurnummer verplicht')
        if (!formData.advertiser_id) return alert('Selecteer een adverteerder')

        try {
            if (editingId) {
                const { error } = await invoiceService.update(editingId, formData)
                if (error) throw error
                // Even opnieuw fetchen is makkelijker hier vanwege de join (advertiser naam)
                fetchData()
            } else {
                const { error } = await invoiceService.create(formData)
                if (error) throw error
                fetchData()
            }
            setIsModalOpen(false)
        } catch (error) {
            const message = (error as { message: string }).message || "Onbekend fout"
            alert('Error: ' + message)
        }
    }

    const handleNew = () => {
        setFormData({
            invoice_number: `INV-${new Date().getFullYear()}-`, // Handige prefix
            amount: 0,
            status: 'draft',
            advertiser_id: advertisers.length > 0 ? advertisers[0].id : '',
            due_date: new Date().toISOString().split('T')[0]
        })
        setEditingId(null)
        setIsModalOpen(true)
    }

    const handleEdit = (inv: InvoiceWithAdvertiser) => {
        setFormData({
            invoice_number: inv.invoice_number,
            amount: inv.amount,
            status: inv.status,
            advertiser_id: inv.advertiser_id,
            due_date: inv.due_date
        })
        setEditingId(inv.id)
        setIsModalOpen(true)
    }

    return (
        <div className="container">
            <div className="admin-header">
                <h1>Facturen</h1>
                <button className="add-btn" onClick={handleNew}>+ Nieuwe Factuur</button>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingId ? "Factuur Bewerken" : "Nieuwe Factuur"}</h2>
                        <form onSubmit={handleSubmit} className="modal-form">

                            <div className="form-group">
                                <label>Adverteerder</label>
                                <select
                                    className="modal-input"
                                    value={formData.advertiser_id || ''}
                                    onChange={e => setFormData({...formData, advertiser_id: e.target.value})}
                                    required
                                >
                                    <option value="" disabled>Selecteer bedrijf...</option>
                                    {advertisers.map(adv => (
                                        <option key={adv.id} value={adv.id}>
                                            {adv.company_name}
                                        </option>
                                    ))}
                                </select>
                                {advertisers.length === 0 && <small style={{color:'red'}}>Maak eerst adverteerders aan!</small>}
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Factuurnummer</label>
                                    <input
                                        className="modal-input"
                                        value={formData.invoice_number}
                                        onChange={e => setFormData({...formData, invoice_number: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Vervaldatum</label>
                                    <input
                                        type="date"
                                        className="modal-input"
                                        value={formData.due_date || ''}
                                        onChange={e => setFormData({...formData, due_date: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Bedrag (€)</label>
                                    <input
                                        type="number" step="0.01"
                                        className="modal-input"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Status</label>
                                    <select
                                        className="modal-input"
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                                    >
                                        <option value="draft">Concept</option>
                                        <option value="sent">Verzonden</option>
                                        <option value="paid">Betaald</option>
                                        <option value="overdue">Te laat</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Annuleren</button>
                                <button type="submit" className="add-btn">Opslaan</button>
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
                            <th>Factuur #</th>
                            <th>Adverteerder</th>
                            <th>Bedrag</th>
                            <th>Status</th>
                            <th>Vervaldatum</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv.id}>
                                <td><strong>{inv.invoice_number}</strong></td>
                                <td>
                                    {/* Hier gebruiken we de ge-join-de data! */}
                                    {inv.advertisers?.company_name || <em>Onbekend</em>}
                                </td>
                                <td>€ {inv.amount.toFixed(2)}</td>
                                <td>
                                        <span className={`badge ${inv.status}`}>
                                            {inv.status}
                                        </span>
                                </td>
                                <td>{inv.due_date}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="edit-btn" onClick={() => handleEdit(inv)}>✏️</button>
                                        <button className="delete-btn" onClick={() => handleDelete(inv.id)}>🗑️</button>
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
