import { Routes, Route, Link } from "react-router-dom";
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

function App() {
  const { token, role, logout } = useAuth();

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Belediye Akıllı Çözüm Sistemi</Link>
        <div className="navbar-links">
          <Link to={role === "admin" ? "/admin" : "/"}>Anasayfa</Link>
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
        <Route path="/sorgula" element={<TrackComplaint />} />
        <Route path="/gecmis-basvurularim"
          element={
            <ProtectedRoute requiredRole="user">
              <MyComplaints />
            </ProtectedRoute>
          } />
      </Routes>
    </div>
  )
}

export default App