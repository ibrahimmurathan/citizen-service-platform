import { Routes, Route, Link } from "react-router-dom";
import './App.css'
import Dashboard from './pages/Dashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminPanel from "./pages/Adminpanel";
import { useAuth } from './context/AuthContext'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { token, logout } = useAuth();

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Belediye Şikayet Sistemi</Link>
        <div className="navbar-links">
          {token ? (
            <button onClick={logout}>Çıkış Yap</button>
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
      </Routes>
    </div>
  )
}

export default App