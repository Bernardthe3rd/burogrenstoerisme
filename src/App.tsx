import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { UserRole } from './types/user'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import BusinessesPage from './pages/BusinessesPage.tsx'
import Navbar from "./components/layout/Navbar.tsx"
import BusinessDetailPage from './pages/BusinessDetailPage'
import "./App.css"
import StudentsPage from "./pages/StudentsPage.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import CorrespondencePage from './pages/CorrespondencePage.tsx';
import AdvertisersPage from "./pages/AdvertisersPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import InvoicesPage from "./pages/InvoicesPage.tsx";
import BannersPage from "./pages/BannersPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import Footer from "./components/layout/Footer.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

function App() {
    const { loadUser, loading } = useAuthStore()

    useEffect(() => {
        loadUser().catch(console.error)
    }, [loadUser])

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/business/:id" element={<BusinessDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdminDashboard/>
                    </ProtectedRoute>
                }/>
                <Route
                    path="/admin/businesses"
                    element={
                        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                            <BusinessesPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/admin/advertisers" element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdvertisersPage/>
                    </ProtectedRoute>
                }/>

                <Route path="/admin/correspondence" element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <CorrespondencePage />
                    </ProtectedRoute>
                } />

                <Route path="/admin/invoices" element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <InvoicesPage />
                    </ProtectedRoute>
                } />

                <Route path="/admin/students" element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <StudentsPage/>
                    </ProtectedRoute>
                }/>

                <Route path="/admin/banners" element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <BannersPage />
                    </ProtectedRoute>
                } />


                <Route path="/student" element={
                    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/register" element={
                    <RegisterPage />
                }/>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}

export default App
