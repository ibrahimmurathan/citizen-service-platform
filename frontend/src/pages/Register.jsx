import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AuthForm.css";

function Register() {
  const [formData, setFormData] = useState({
    user_full_name: "",
    user_email: "",
    user_phone_number: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await registerUser(formData);
      login(result.access_token, result.role, result.full_name);
      navigate("/");
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Kayıt Ol</h1>
        <p className="auth-subtitle">Hızlıca bir hesap oluşturun.</p>

        <div className="auth-section">
          <label className="section-label">Ad Soyad</label>
          <input
            className="auth-input"
            name="user_full_name"
            placeholder="Ad Soyad"
            value={formData.user_full_name}
            onChange={handleChange}
          />
        </div>

        <div className="auth-section">
          <label className="section-label">Email</label>
          <input
            className="auth-input"
            name="user_email"
            type="email"
            placeholder="ornek@email.com"
            value={formData.user_email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-section">
          <label className="section-label">Telefon</label>
          <input
            className="auth-input"
            name="user_phone_number"
            placeholder="05XX XXX XX XX"
            value={formData.user_phone_number}
            onChange={handleChange}
          />
        </div>

        <div className="auth-section">
          <label className="section-label">Şifre</label>
          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Şifreniz"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="auth-button">Kayıt Ol</button>

        {error && <p className="status-error">{error}</p>}

        <p className="auth-switch">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;