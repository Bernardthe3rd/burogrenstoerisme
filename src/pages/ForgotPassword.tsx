import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import './ForgotPassword.css'
import InputField from "../components/layout/InputField.tsx";
import ButtonLink from "../components/layout/ButtonLink.tsx"; // Importeer de CSS

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
        <main className="container">
            <article className="fp-card">
                <div className="fp-header">
                    <h2>Wachtwoord vergeten?</h2>
                    <p>Vul je e-mailadres in en we sturen je een link om een nieuw wachtwoord in te stellen.</p>
                </div>

                <form onSubmit={handleResetRequest} className="fp-form">
                    <div className="fp-form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <InputField type="email" placeholder="" value={email} handleChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {errorMsg && <div className="fp-alert fp-error">{errorMsg}</div>}
                    {msg && <div className="fp-alert fp-success">{msg}</div>}

                    <ButtonLink text={loading ? 'Versturen...' : 'Stuur herstellink'} type="submit" disabled={loading} />
                </form>
            </article>
            <div className="fp-footer">
                <Link to="/login" className="fp-back-link">← Terug naar inloggen</Link>
            </div>
        </main>
    )
}
