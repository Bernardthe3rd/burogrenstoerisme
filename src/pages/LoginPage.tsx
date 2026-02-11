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
    const navigate = useNavigate()
    const { loadUser } = useAuthStore()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const { error } = await authService.signIn(email, password)

        if (error) {
            setError(error.message)
            return
        }

        await loadUser()
        navigate('/')
    }

    return (
        <div className="container">
            <div className="login__form-section">
                <h1>Login</h1>
                <form onSubmit={handleLogin} className="login__form">
                    <InputField type="email" placeholder="Email" value={email} handleChange={(e) => setEmail(e.target.value)} />
                    <InputField type="password" placeholder="Wachtwoord" value={password} handleChange={(e) => setPassword(e.target.value)} />
                    <ButtonLink type="submit" text="Login" />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
            <div className="login__btn-nav">
                <ButtonNav path="/forgot-password" text="wachtwoord vergeten?"/>
            </div>
        </div>
    )
}
