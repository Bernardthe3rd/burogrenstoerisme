import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import './ForgotPassword.css' // Importeer de CSS

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMsg('')
        setErrorMsg('')

        // Dynamisch de URL bepalen (werkt op localhost én live)
        const redirectUrl = window.location.origin + '/update-password'

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        })

        if (error) {
            setErrorMsg('Er ging iets mis: ' + error.message)
        } else {
            setMsg('Check je inbox! We hebben een link gestuurd om je wachtwoord te resetten.')
        }
        setLoading(false)
    }

    return (
        <div className="container">
            <div className="fp-card">
                <h2>Wachtwoord vergeten?</h2>
                <p className="fp-description">Vul je e-mailadres in en we sturen je een link om een nieuw wachtwoord in te stellen.</p>

                <form onSubmit={handleResetRequest} className="fp-form">
                    <div className="fp-form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="jouw@email.nl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {errorMsg && <div className="fp-alert fp-error">{errorMsg}</div>}
                    {msg && <div className="fp-alert fp-success">{msg}</div>}

                    <button disabled={loading} className="fp-submit-btn">
                        {loading ? 'Versturen...' : 'Stuur herstellink'}
                    </button>
                </form>

                <div className="fp-footer">
                    <Link to="/login" className="fp-back-link">← Terug naar inloggen</Link>
                </div>
            </div>
        </div>
    )
}
