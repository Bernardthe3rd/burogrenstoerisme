import { useEffect, useState } from 'react'
import { studentService, type Student, type StudentInsert } from '../services/students'
import './BusinessesPage.css' // We hergebruiken gewoon de CSS van het dashboard!

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]) // <--- Hier gebruiken we het Type!
    const [loading, setLoading] = useState(true)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Formulier data (matcht met StudentInsert type)
    const [formData, setFormData] = useState<StudentInsert>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        commission_rate: 0,
        can_view_correspondence: true,
        can_view_financials: false
    })

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true)
            const { data } = await studentService.getAll()
            if (data) setStudents(data)
            setLoading(false)
        }

        fetchStudents().catch(console.error)
    }, [])

    const handleDelete = async (id: string) => {
        if (!window.confirm('Weet je zeker dat je deze student wilt verwijderen?')) return
        const { error } = await studentService.delete(id)
        if (!error) setStudents(prev => prev.filter(s => s.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.first_name || !formData.last_name) return alert('Naam is verplicht')

        try {
            if (editingId) {
                const { data, error } = await studentService.update(editingId, formData)
                if (error) throw error
                setStudents(prev => prev.map(s => s.id === editingId ? data as Student : s))
            } else {
                const { data, error } = await studentService.create(formData)
                if (error) throw error
                setStudents(prev => [data as Student, ...prev])
            }
            closeModal()
        } catch (error) {
            const message = (error as { message: string }).message || "Onbekend fout"
            alert('Error: ' + message)
        }
    }

    const handleEdit = (student: Student) => {
        setFormData({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            phone: student.phone,
            commission_rate: student.commission_rate,
            can_view_correspondence: student.can_view_correspondence,
            can_view_financials: student.can_view_financials
        })
        setEditingId(student.id)
        setIsModalOpen(true)
    }

    const handleNew = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            commission_rate: 10, // Default 10% commissie
            can_view_correspondence: true,
            can_view_financials: false
        })
        setEditingId(null)
        setIsModalOpen(true)
    }

    const closeModal = () => setIsModalOpen(false)

    return (
        <div className="container">
            <div className="admin-header">
                <h1>Studenten Beheer</h1>
                <button className="add-btn" onClick={handleNew}>+ Nieuwe Student</button>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingId ? "Student Bewerken" : "Nieuwe Student"}</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Voornaam</label>
                                    <input
                                        className="modal-input"
                                        value={formData.first_name}
                                        onChange={e => setFormData({...formData, first_name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Achternaam</label>
                                    <input
                                        className="modal-input"
                                        value={formData.last_name}
                                        onChange={e => setFormData({...formData, last_name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    className="modal-input"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Commissie (%)</label>
                                <input
                                    className="modal-input"
                                    type="number"
                                    min="0" max="100"
                                    value={formData.commission_rate || 0}
                                    onChange={e => setFormData({...formData, commission_rate: Number(e.target.value)})}
                                />
                            </div>

                            <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                                <input
                                    type="checkbox"
                                    checked={formData.can_view_financials || false}
                                    onChange={e => setFormData({...formData, can_view_financials: e.target.checked})}
                                />
                                <label style={{margin: 0}}>Mag financiën zien?</label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="cancel-btn">Annuleren</button>
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
                            <th>Naam</th>
                            <th>Email</th>
                            <th>Commissie</th>
                            <th>Rechten</th>
                            <th>Acties</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td><strong>{student.first_name} {student.last_name}</strong></td>
                                <td>{student.email}</td>
                                <td>{student.commission_rate}%</td>
                                <td>
                                    {student.can_view_financials ? '💰' : '❌'}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="edit-btn" onClick={() => handleEdit(student)}>✏️</button>
                                        <button className="delete-btn" onClick={() => handleDelete(student.id)}>🗑️</button>
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
