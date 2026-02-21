import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import './RegisterPage.css'
import ButtonLink from "../components/layout/ButtonLink.tsx";
import InputField from "../components/layout/InputField.tsx";

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
        <main className="container">
            <article className="register-card">
                <div className="register__header">
                    <h1>Registreren</h1>
                    <p>Maak een account aan om toegang te krijgen.</p>
                </div>
                <form onSubmit={handleRegister} className="register__form">
                    <div className="register__form-group">
                        <label>Email</label>
                        <InputField type="email" placeholder="" value={email} handleChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="register__form-group">
                        <label>Wachtwoord</label>
                        <InputField type="password" placeholder="" value={password} handleChange={e => setPassword(e.target.value)} />
                    </div>
                    <ButtonLink text={loading ? 'Bezig...' : 'Account Aanmaken'} type="submit" disabled={loading} />
                </form>

            </article>
            <div className="register__footer">
                <p>Heb je al een account? <Link to="/login">Log hier in</Link></p>
            </div>
        </main>
    )
}