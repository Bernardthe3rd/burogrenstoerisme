import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import './RegisterPage.css'
import ButtonLink from "../components/layout/ButtonLink.tsx";

export default function RegisterPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            if (data.session) {
                alert("Account aangemaakt! Je wordt nu ingelogd.")
                navigate('/') // Of naar /student dashboard
            } else {
                // Soms staat 'Email Confirmations' aan in Supabase
                alert("Check je email om je account te bevestigen!")
            }

        } catch (error) {
            const msg = (error as {message: string}).message || 'Kon registratie niet voltooien'
            alert('Fout bij registreren: ' + msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="login-card">
                <h1>Registreren</h1>
                <p>Maak een account aan om toegang te krijgen.</p>

                <form onSubmit={handleRegister} className="register__form">
                    <div className="register__form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="register__form-group">
                        <label>Wachtwoord</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <ButtonLink text={loading ? 'Bezig...' : 'Account Aanmaken'} type="submit" />
                </form>

                <div className="register__footer">
                    <p>Heb je al een account? <Link to="/login">Log hier in</Link></p>
                </div>
            </div>
        </div>
    )
}