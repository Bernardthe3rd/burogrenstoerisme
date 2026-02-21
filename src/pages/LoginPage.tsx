import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import ButtonNav from "../components/layout/ButtonNav.tsx";
import "./LoginPage.css"
import InputField from "../components/layout/InputField.tsx";
import ButtonLink from "../components/layout/ButtonLink.tsx";

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { loadUser } = useAuthStore()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await authService.signIn(email, password)

        if (error) {
            setError(error.message)
            return
        }

        await loadUser()
        setLoading(false)
        navigate('/')
    }

    return (
        <main className="container">
            <article className="login-card">
                <div className="login__header">
                    <h1>Login</h1>
                    <p>Log hier in met je persoonlijk gegevens</p>
                </div>
                <form onSubmit={handleLogin} className="login__form">
                    <div className="login__form-group">
                        <label>Email</label>
                        <InputField type="email" placeholder="" value={email} handleChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="login__form-group">
                        <label>Password</label>
                        <InputField type="password" placeholder="" value={password} handleChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <ButtonLink type="submit" text="Login" disabled={loading} />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </article>
            <div className="login__footer">
                <ButtonNav path="/forgot-password" text="wachtwoord vergeten?"/>
            </div>
        </main>
    )
}
