import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import './UpdatePassword.css' // Importeer de CSS

export default function UpdatePassword() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setErrorMsg('Kon wachtwoord niet opslaan: ' + error.message)
            setLoading(false)
        } else {
            setMsg('Succes! Je wachtwoord is aangepast.')
            // Even wachten zodat de gebruiker het bericht ziet, dan doorsturen
            setTimeout(() => {
                navigate('/')
            }, 2000)
        }
    }

    return (
        <div className="container">
            <div className="up-card">
                <h2>Nieuw wachtwoord</h2>
                <p className="up-description">Kies een sterk nieuw wachtwoord voor je account.</p>

                <form onSubmit={handlePasswordUpdate}>
                    <div className="up-form-group">
                        <label htmlFor="new-password">Nieuw wachtwoord</label>
                        <input
                            id="new-password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Minimaal 6 tekens"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {errorMsg && <div className="up-alert up-error">{errorMsg}</div>}
                    {msg && <div className="up-alert up-success">{msg}</div>}

                    <button disabled={loading} className="up-submit-btn">
                        {loading ? 'Bezig met opslaan...' : 'Wachtwoord opslaan'}
                    </button>
                </form>
            </div>
        </div>
    )
}
