import { useEffect, useState } from 'react'
import { studentDashboardService, type StudentStats } from '../services/studentDashboard'
import { studentService } from '../services/students'
import { correspondenceService, type CorrespondenceWithAdvertiser } from '../services/correspondence'
import './StudentDashboard.css'
import './BusinessesPage.css'

// We definiëren hier lokaal even wat types om 'any' te vermijden
interface DashboardAdvertiser {
    id: string
    company_name: string
    contact_person: string | null
    email: string
    phone: string | null
}

interface DashboardInvoice {
    id: string
    created_at: string
    invoice_number: string
    amount: number
    status: string
    advertisers: { company_name: string }
}

export default function StudentDashboard() {
    const [loading, setLoading] = useState(true)
    const [advertisers, setAdvertisers] = useState<DashboardAdvertiser[]>([])
    const [invoices, setInvoices] = useState<DashboardInvoice[]>([])
    const [canViewFinancials, setCanViewFinancials] = useState(false)
    const [stats, setStats] = useState<StudentStats>({
        totalCommission: 0,
        activeAdvertisers: 0,
        pendingCommission: 0
    })
    const [commissionRate, setCommissionRate] = useState(0)

    const [messages, setMessages] = useState<CorrespondenceWithAdvertiser[]>([])
    const [canViewMessages, setCanViewMessages] = useState(false) // Permissie check


    useEffect(() => {

        const loadData = async () => {
            setLoading(true)
            try {
                // 1. Wie ben ik?
                const studentId = await studentDashboardService.getMyStudentId()
                if (!studentId) {
                    // Geen student ID gevonden (bijv. ingelogd als pure admin zonder student profiel)
                    alert("Geen gekoppeld studenten profiel gevonden.")
                    setLoading(false)
                    return
                }

                // 2. Haal mijn profiel op (voor commissie %)
                // Let op: studentService.getById returnt { data, error }
                const dataOneStudent = await studentService.getById(studentId)
                const studentData = dataOneStudent.data

                setCanViewFinancials(studentData?.can_view_financials || false)
                const canViewMsg = studentData?.can_view_correspondence || false
                setCanViewMessages(canViewMsg)
                // Veilige fallback naar 0 als commission_rate null is
                const rate = studentData?.commission_rate || 0
                setCommissionRate(rate)

                // 3. Haal mijn data op
                const [advRes, invRes] = await Promise.all([
                    studentDashboardService.getMyAdvertisers(studentId),
                    studentDashboardService.getMyInvoices(studentId)
                ])

                if (advRes.data) {
                    // We casten de data naar ons lokale type
                    setAdvertisers(advRes.data as unknown as DashboardAdvertiser[])
                }

                if (invRes.data) {
                    // Casten naar DashboardInvoice[]
                    const myInvoices = invRes.data as unknown as DashboardInvoice[]
                    setInvoices(myInvoices)

                    // Bereken stats
                    const statistics = studentDashboardService.calculateStats(myInvoices, rate)
                    statistics.activeAdvertisers = advRes.data?.length || 0
                    setStats(statistics)
                }

                if (canViewMsg) {
                    const msgData = await correspondenceService.getMyMessages()
                    const message = msgData.typedData;
                    if (message) setMessages(message)
                }

            } catch (error) {
                console.error("Dashboard error:", error)
            }
            setLoading(false)
        }

        loadData().catch(console.error)
    }, [])



    if (loading) return <div className="container"><p>Laden...</p></div>

    return (
        <div className="container">
            <div className="dashboard-header">
                <h1>Mijn Dashboard</h1>
                <div className="commission-badge">
                    Mijn Commissie: <strong>{commissionRate}%</strong>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="kpi-grid">
                <div className="kpi-card green">
                    <h3>Gerealiseerd</h3>
                    <p className="kpi-amount">{canViewFinancials ? `€ ${stats.totalCommission.toFixed(2)}` : '***'}</p>
                    <small>Uitbetaald of Betaald door klant</small>
                </div>
                <div className="kpi-card yellow">
                    <h3>Verwacht</h3>
                    <p className="kpi-amount">{canViewFinancials ? `€ ${stats.pendingCommission.toFixed(2)}` : '***'}</p>
                    <small>Facturen nog openstaand</small>
                </div>
                <div className="kpi-card blue">
                    <h3>Klanten</h3>
                    <p className="kpi-amount">{stats.activeAdvertisers}</p>
                    <small>Aantal actieve adverteerders</small>
                </div>
            </div>

            {/* Sectie 1: Mijn Adverteerders */}
            <div className="dashboard-section">
                <h2>Mijn Adverteerders</h2>
                {advertisers.length === 0 ? <p>Nog geen adverteerders gekoppeld.</p> : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>Bedrijf</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Telefoon</th>
                            </tr>
                            </thead>
                            <tbody>
                            {advertisers.map(adv => (
                                <tr key={adv.id}>
                                    <td><strong>{adv.company_name}</strong></td>
                                    <td>{adv.contact_person || '-'}</td>
                                    <td>{adv.email}</td>
                                    <td>{adv.phone || '-'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sectie 2: Facturen */}
            <div className="dashboard-section">
                <h2>Factuur Status & Commissie</h2>
                {invoices.length === 0 ? <p>Nog geen facturen gevonden.</p> : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Klant</th>
                                <th>Factuur</th>
                                <th>Bedrag</th>
                                <th>Status</th>
                                {canViewFinancials && <th>Mijn Deel ({commissionRate}%)</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id}>
                                    <td>{new Date(inv.created_at).toLocaleDateString('nl-NL')}</td>
                                    <td>{inv.advertisers?.company_name || 'Onbekend'}</td>
                                    <td>{inv.invoice_number}</td>
                                    <td>€ {inv.amount.toFixed(2)}</td>
                                    <td><span className={`badge ${inv.status}`}>{inv.status}</span></td>
                                    {canViewFinancials ? (
                                    <td className={`commission-cell ${inv.status === 'paid' ? 'text-success' : 'text-muted'}`}>
                                        € {(inv.amount * (commissionRate / 100)).toFixed(2)}
                                    </td>) : null}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {canViewMessages && (
                <div className="dashboard-section">
                    <h2>Berichten & Updates</h2>
                    {messages.length === 0 ? <p>Geen berichten gevonden.</p> : (
                        <div className="message-list">
                            {messages.map(msg => (
                                <div key={msg.id} className="message-item">
                                    <div className="message-header">
                                        <span className="message-subject">{msg.subject}</span>
                                        <span className="message-date">
                                        {new Date(msg.created_at || '').toLocaleDateString()}
                                    </span>
                                    </div>
                                    <div className="message-meta">
                                        Betreft: <strong>{msg.advertisers?.company_name}</strong>
                                    </div>
                                    <p className="message-body">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
