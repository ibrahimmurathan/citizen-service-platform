import { Routes, Route, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import './App.css'
import Dashboard from './pages/Dashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminPanel from "./pages/Adminpanel";
import { useAuth } from './context/AuthContext'
import ProtectedRoute from "./components/ProtectedRoute";
import MyComplaints from './pages/MyComplaints'
import TrackComplaint from './pages/TrackComplaint'
import ChangePasswordModal from "./pages/ChangePasswordModal";
import ChangeEmailModal from "./pages/ChangeEmailModal";

function App() {
  const { token, role, fullName, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Belediye Akıllı Çözüm Sistemi</Link>
        <div className="navbar-links">
          <Link to={role === "admin" ? "/admin" : "/"}>Anasayfa</Link>
          {token ? (
            // Admin kendi panelindeki dropdown'ı kullanıyor navbar dropdown'ı sadece user için
            role === "user" ? (
              <div className="navbar-user-menu" ref={dropdownRef}>
                <button
                  id="navbar-user-menu-btn"
                  className="navbar-user-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <span className="navbar-avatar">{fullName?.charAt(0).toUpperCase()}</span>
                  <span className="navbar-user-name">{fullName}</span>
                  <span className={`navbar-chevron ${dropdownOpen ? "open" : ""}`}>▾</span>
                </button>
                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <button
                      id="navbar-change-pw-item"
                      className="navbar-dropdown-item"
                      onClick={() => { setShowChangePw(true); setDropdownOpen(false); }}
                    >
                      🔑 Şifre Değiştir
                    </button>
                    <button
                      id="navbar-change-email-item"
                      className="navbar-dropdown-item"
                      onClick={() => { setShowChangeEmail(true); setDropdownOpen(false); }}
                    >
                      ✉️ E-posta Değiştir
                    </button>
                    <button
                      id="navbar-logout-item"
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      onClick={logout}
                    >
                      🚪 Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : null
          ) : (
            <>
              <Link to="/login">Giriş Yap</Link>
              <Link to="/register">Kayıt Ol</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sikayet-olustur"
          element={
            <ProtectedRoute requiredRole="user">
              <SubmitComplaint />
            </ProtectedRoute>
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
        <Route path="/sorgula" element={<TrackComplaint />} />
        <Route path="/gecmis-basvurularim"
          element={
            <ProtectedRoute requiredRole="user">
              <MyComplaints />
            </ProtectedRoute>
          } />
      </Routes>

      {showChangePw && (
        <ChangePasswordModal onClose={() => setShowChangePw(false)} />
      )}
      {showChangeEmail && (
        <ChangeEmailModal onClose={() => setShowChangeEmail(false)} />
      )}
    </div>
  )
}

export default App