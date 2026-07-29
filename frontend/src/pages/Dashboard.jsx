import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { token, role, fullName } = useAuth();
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

  const handleMyComplaintsClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role === "admin") {
      alert("Bu özellik sadece vatandaşlar içindir.");
      return;
    }
    navigate("/gecmis-basvurularim");
  };

  const handleQueryClick = () => {
    navigate("/sorgula");
  };

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <h1>{fullName ? `Hoş Geldiniz, ${fullName}` : "Hoş Geldiniz"}</h1>

        <div className="hero-cards">
          <button className="hero-card" onClick={handleComplaintClick}>
            <div className="hero-card-icon">📋</div>
            <div className="hero-card-text">
              <strong>Talep / Şikâyet Oluştur</strong>
              <span>Form ile başvuru oluşturun</span>
            </div>
            <span className="hero-card-arrow">›</span>
          </button>

          <button className="hero-card" onClick={handleMyComplaintsClick}>
            <div className="hero-card-icon">🕘</div>
            <div className="hero-card-text">
              <strong>Geçmiş Başvurularım</strong>
              <span>Başvurularınızı takip edin</span>
            </div>
            <span className="hero-card-arrow">›</span>
          </button>

          <button className="hero-card" onClick={handleQueryClick}>
            <div className="hero-card-icon">🔍</div>
            <div className="hero-card-text">
              <strong>Şikayetimi Sorgula</strong>
              <span>Takip numaranızla şikayetinizi sorgulayın</span>
            </div>
            <span className="hero-card-arrow">›</span>
          </button>
        </div>
      </section>

      <section className="dashboard-info">
        <h2>Nasıl Çalışır?</h2>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-icon">📷</div>
            <strong>1. Fotoğraf Çekin</strong>
            <p>Karşılaştığınız sorunu fotoğraflayın</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon">📍</div>
            <strong>2. Konum Seçin</strong>
            <p>Sorunun yerini haritadan işaretleyin</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon">✅</div>
            <strong>3. Gönderin</strong>
            <p>Şikayetiniz ilgili birime otomatik yönlendirilir</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;