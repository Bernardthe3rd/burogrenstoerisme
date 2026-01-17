import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { UserRole } from './types/user'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import StudentPortal from './pages/StudentPortal'
import Navbar from "./components/layout/Navbar.tsx";
import "./App.css"

function App() {
    const { loadUser, loading } = useAuthStore()

    useEffect(() => {
        loadUser()
    }, [loadUser])

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/*"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.ADMIN]}>
                            <StudentPortal />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
