import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'

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
        navigate('/admin')
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}
