import { useEffect, useState } from 'react'
import { bannerService, type Banner } from '../services/banners'
import './BannersPage.css'
import './AdminDashboard.css'

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Form state
    const [title, setTitle] = useState('')
    const [linkUrl, setLinkUrl] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        loadBanners().catch(console.error)
    }, [refreshKey])

    const loadBanners = async () => {
        setLoading(true)
        const { data } = await bannerService.getAllAdmin()
        if (data) setBanners(data)
        setLoading(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile || !title) return alert("Kies een plaatje en titel!")

        setUploading(true)
        try {
            await bannerService.create(title, linkUrl, selectedFile)

            // Reset & Close
            setIsModalOpen(false)
            setTitle('')
            setLinkUrl('')
            setSelectedFile(null)
            setRefreshKey(old => old + 1)

        } catch (error) {
            const msg = (error as {message: string}).message || 'Kon bestand niet uploaden'
            alert('Upload mislukt: ' + msg)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!window.confirm("Weet je zeker dat je deze banner wilt verwijderen?")) return

        await bannerService.delete(id, imageUrl)
        setRefreshKey(old => old + 1)
    }

    const toggleStatus = async (banner: Banner) => {
        await bannerService.toggleActive(banner.id, banner.is_active)
        setRefreshKey(old => old + 1)
    }

    return (
        <div className="container">
            <div className="admin-header">
                <h1>Promotie Banners</h1>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                    + Nieuwe Banner
                </button>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Banner Uploaden</h2>
                        <form onSubmit={handleSubmit} className="modal-form">

                            <div className="form-group">
                                <label>Titel (Intern gebruik)</label>
                                <input
                                    className="modal-input"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Bijv. Zomeractie Supermarkt X"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Afbeelding</label>
                                <input
                                    type="file"
                                    className="modal-input"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                                <small style={{color:'#666'}}>Aanbevolen formaat: 1200x300 pixels (breed)</small>
                            </div>

                            <div className="form-group">
                                <label>Link URL (Optioneel)</label>
                                <input
                                    className="modal-input"
                                    value={linkUrl}
                                    onChange={e => setLinkUrl(e.target.value)}
                                    placeholder="https://www.restaurant-x.de/menu"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">
                                    Annuleren
                                </button>
                                <button type="submit" className="add-btn" disabled={uploading}>
                                    {uploading ? 'Uploaden...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- GRID --- */}
            {loading ? <p>Laden...</p> : (
                <div className="banner-grid">
                    {banners.map(banner => (
                        <div key={banner.id} className="banner-card">
                            <img src={banner.image_url} alt={banner.title} className="banner-preview" />

                            <button
                                className="delete-icon"
                                onClick={() => handleDelete(banner.id, banner.image_url)}
                                title="Verwijderen"
                            >
                                🗑️
                            </button>

                            <div className="banner-content">
                                <div className="banner-title">{banner.title}</div>
                                {banner.link_url && (
                                    <a href={banner.link_url} target="_blank" rel="noreferrer" className="banner-link">
                                        🔗 {banner.link_url}
                                    </a>
                                )}

                                <div className="banner-stats">
                                    <span>👆 {banner.clicks} Clicks</span>

                                    <button
                                        className={`banner-status ${banner.is_active ? 'status-active' : 'status-inactive'}`}
                                        onClick={() => toggleStatus(banner)}
                                        style={{cursor: 'pointer', border: 'none'}}
                                    >
                                        {banner.is_active ? 'Actief' : 'Inactief'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && (
                        <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#888', marginTop: '40px'}}>
                            Nog geen banners. Upload er eentje om te beginnen!
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
