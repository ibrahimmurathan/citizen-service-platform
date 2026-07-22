import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    <form onSubmit={handleSubmit}>
      <h2>Giriş Yap</h2>
      <input
        name="user_email"
        type="email"
        placeholder="Email"
        value={formData.user_email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Şifre"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Giriş Yap</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;