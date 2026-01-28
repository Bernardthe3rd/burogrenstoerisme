import { useEffect, useState } from 'react'
import { invoiceService, type InvoiceWithAdvertiser, type InvoiceInsert } from '../services/invoices'
import { advertiserService, type Advertiser } from '../services/advertisers'
import './InvoicesPage.css'
import './AdminDashboard.css'

// 1. FIX: Specifiek type definiëren om 'any' te vermijden
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'

export default function InvoicesPage() {
    const [loading, setLoading] = useState(true)
    const [invoices, setInvoices] = useState<InvoiceWithAdvertiser[]>([])
    const [advertisers, setAdvertisers] = useState<Advertiser[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [formData, setFormData] = useState<Partial<InvoiceInsert>>({
        advertiser_id: '',
        invoice_number: `INV-${new Date().getFullYear()}-001`,
        amount: 0,
        status: 'draft',
        description: '',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const [invRes, advRes] = await Promise.all([
                    invoiceService.getAll(),
                    advertiserService.getAll()
                ])

                if (invRes.data) setInvoices(invRes.data)
                if (advRes.data) setAdvertisers(advRes.data as unknown as Advertiser[])

            } catch (error) {
                console.error("Error loading data", error)
            } finally {
                setLoading(false)
            }
        }

        // 2. FIX: Promise afhandeling
        loadData().catch(console.error)
    }, [refreshKey])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.advertiser_id || !formData.amount || !formData.due_date) {
            window.alert('Vul alle verplichte velden in.')
            return
        }

        const { error } = await invoiceService.create(formData as InvoiceInsert)

        if (error) {
            window.alert('Fout bij opslaan: ' + error.message)
            return
        }

        setIsModalOpen(false)
        setRefreshKey(old => old + 1)

        setFormData({
            advertiser_id: '',
            invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            amount: 0,
            status: 'draft',
            description: '',
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Weet je zeker dat je deze factuur wilt verwijderen?')) return
        await invoiceService.delete(id)
        setRefreshKey(old => old + 1)
    }

    // 3. FIX: Typed status meegeven in plaats van string/any
    const handleStatusChange = async (id: string, newStatus: InvoiceStatus) => {
        // TypeScript weet nu dat newStatus veilig is
        await invoiceService.update(id, { status: newStatus })
        setRefreshKey(old => old + 1)
    }

    return (
        <div className="container invoices-container">
            <div className="admin-header">
                <h1>Facturatie</h1>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                    + Nieuwe Factuur
                </button>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Nieuwe Factuur Maken</h2>
                        <form onSubmit={handleSubmit} className="modal-form">

                            <div className="form-group">
                                <label>Klant (Adverteerder)</label>
                                <select
                                    className="modal-input"
                                    value={formData.advertiser_id || ''}
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

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Factuurnummer</label>
                                    <input
                                        className="modal-input"
                                        value={formData.invoice_number || ''}
                                        onChange={e => setFormData({...formData, invoice_number: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Vervaldatum</label>
                                    <input
                                        type="date"
                                        className="modal-input"
                                        value={formData.due_date || ''}
                                        onChange={e => setFormData({...formData, due_date: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Omschrijving</label>
                                <input
                                    className="modal-input"
                                    placeholder="Bijv. Promotie Q1 2026"
                                    value={formData.description || ''}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Bedrag (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="modal-input"
                                        value={formData.amount || 0}
                                        onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        className="modal-input"
                                        value={formData.status || 'draft'}
                                        // 4. FIX: Casten naar ons specifieke type
                                        onChange={e => setFormData({...formData, status: e.target.value as InvoiceStatus})}
                                    >
                                        <option value="draft">Concept</option>
                                        <option value="sent">Verzonden</option>
                                        <option value="paid">Betaald</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Annuleren</button>
                                <button type="submit" className="add-btn">Aanmaken</button>
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
                            <th>Nr. & Datum</th>
                            <th>Klant</th>
                            <th>Omschrijving</th>
                            <th style={{textAlign: 'right'}}>Bedrag</th>
                            <th>Status</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map(inv => {
                            const isPaid = inv.status === 'paid'
                            const isOverdue = !isPaid && inv.due_date && new Date(inv.due_date) < new Date()

                            return (
                                <tr key={inv.id}>
                                    <td>
                                        <div className="invoice-number">{inv.invoice_number}</div>
                                        <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                                            {inv.due_date || '-'}
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{inv.advertisers?.company_name || 'Onbekend'}</strong>
                                        <br/>
                                        <small style={{color:'#666'}}>{inv.advertisers?.contact_person}</small>
                                    </td>
                                    <td>{inv.description}</td>
                                    <td className="amount-cell">
                                        € {(inv.amount || 0).toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                                    </td>
                                    <td>
                                        <select
                                            className={`status-badge ${inv.status || 'draft'}`}
                                            value={inv.status || 'draft'}
                                            // 4. FIX: Casten naar ons specifieke type
                                            onChange={(e) => handleStatusChange(inv.id, e.target.value as InvoiceStatus)}
                                            style={{border: 'none', cursor: 'pointer'}}
                                        >
                                            <option value="draft">Concept</option>
                                            <option value="sent">Verzonden</option>
                                            <option value="paid">Betaald</option>
                                            <option value="overdue">Vervallen</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(inv.id)}>🗑️</button>
                                    </td>
                                </tr>
                            )
                        })}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{textAlign:'center', padding:'30px', color:'#888'}}>
                                    Nog geen facturen aangemaakt.
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
