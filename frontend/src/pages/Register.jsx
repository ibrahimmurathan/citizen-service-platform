import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    try {
      const result = await registerUser(formData);
      login(result.access_token, result.role, result.full_name);
      navigate("/");
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Kayıt Ol</h2>
      <input name="user_full_name" placeholder="Ad Soyad" value={formData.user_full_name} onChange={handleChange} />
      <input name="user_email" type="email" placeholder="Email" value={formData.user_email} onChange={handleChange} />
      <input name="user_phone_number" placeholder="Telefon" value={formData.user_phone_number} onChange={handleChange} />
      <input name="password" type="password" placeholder="Şifre" value={formData.password} onChange={handleChange} />
      <button type="submit">Kayıt Ol</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Register;