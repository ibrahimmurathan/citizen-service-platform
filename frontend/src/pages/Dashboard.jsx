import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { token, role, fullName, logout } = useAuth();
  const navigate = useNavigate();

  const handleComplaintClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role === "admin") {
      alert("Adminler şikayet oluşturamaz.");
      return;
    }
    navigate("/sikayet-olustur");
  };

  return (
    <div>
      <header>
        {token && role === "user" && <span>Hoş geldiniz, {fullName}</span>}
      </header>

      <h1>Belediye Beyaz Masa</h1>
      <p>Şehrimizle ilgili sorunlarınızı bize bildirin.</p>

      <button onClick={handleComplaintClick}>Şikayet Oluştur</button>
    </div>
  );
}

export default Dashboard;