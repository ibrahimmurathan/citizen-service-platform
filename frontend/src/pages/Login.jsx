import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AuthForm.css";

function Login() {
  const [formData, setFormData] = useState({
    user_email: "",
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
      const result = await loginUser(formData);
      login(result.access_token, result.role, result.full_name);

      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Email veya şifre hatalı.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Giriş Yap</h1>
        <p className="auth-subtitle">Hesabınıza giriş yaparak devam edin.</p>

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

        <button type="submit" className="auth-button">Giriş Yap</button>

        {error && <p className="status-error">{error}</p>}

        <p className="auth-switch">
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;