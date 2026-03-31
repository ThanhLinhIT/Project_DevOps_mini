import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar        from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage       from './pages/HomePage';
import BookingsPage   from './pages/BookingsPage';
import AboutPage      from './pages/AboutPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard  from './pages/UserDashboard';
import NotFoundPage   from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* ── Public ────────────────────────────────── */}
            <Route path="/"         element={<HomePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Authenticated ─────────────────────────── */}
            <Route path="/dashboard" element={
              <ProtectedRoute><UserDashboard /></ProtectedRoute>
            } />

            {/* ── Admin only ────────────────────────────── */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
