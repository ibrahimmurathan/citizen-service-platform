import { Routes, Route, Link } from "react-router-dom";
import './App.css'
import Dashboard from './pages/Dashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminPanel from "./pages/Adminpanel";
import { useAuth } from './context/AuthContext'

function App() {
  const { token, logout } = useAuth();

  return (
    <div className="App">
      <nav>
        {token ? (
          <button onClick={logout}>Çıkış Yap</button>
        ) : (
          <>
            <Link to="/login">Giriş Yap</Link>
            <Link to="/register">Kayıt Ol</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sikayet-olustur" element={<SubmitComplaint />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  )
}

export default App