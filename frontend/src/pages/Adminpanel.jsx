import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useAuth } from "../context/AuthContext";
import {
  getComplaints,
  updateComplaintStatus,
  createTransfer,
  getIncomingTransfers,
  getOutgoingTransfers,
  respondToTransfer,
} from "../services/api";
import ChangePasswordModal from "./ChangePasswordModal";
import "leaflet/dist/leaflet.css";
import "./AdminPanel.css";

const STATUS_LABELS = {
  beklemede: "Beklemede",
  inceleniyor: "İnceleniyor",
  cozuldu: "Çözüldü",
  reddedildi: "Reddedildi",
  silindi: "Silindi",
};

const CATEGORY_LABELS = {
  yol_altyapi: "Yol ve Altyapı",
  cevre_atik: "Çevre ve Katı Atık",
  kent_estetik: "Kent Estetiği",
  ulasim_trafik: "Ulaşım ve Trafik",
  yapi_imar: "Yapı ve İmar",
};

function AdminPanel() {
  const { token, fullName, role, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const dropdownRef = useRef(null);
  const [deletedComplaints, setDeletedComplaints] = useState([]);
  const [incomingTransfers, setIncomingTransfers] = useState([]);
  const [outgoingTransfers, setOutgoingTransfers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [transferTarget, setTransferTarget] = useState("");

  const loadComplaints = async () => {
    try {
      const data = await getComplaints(token);
      setComplaints(data);
    } catch (err) {
      setError("Şikayetler yüklenemedi.");
    }
  };

  const loadDeletedComplaints = async () => {
    try {
      const data = await getComplaints(token, "silindi");
      setDeletedComplaints(data);
    } catch (err) {
      setError("Silinen şikayetler yüklenemedi.");
    }
  };

  const loadIncomingTransfers = async () => {
    try {
      const data = await getIncomingTransfers(token);
      setIncomingTransfers(data);
    } catch (err) {
      setError("Transfer talepleri yüklenemedi.");
    }
  };

  const loadOutgoingTransfers = async () => {
    try {
      const data = await getOutgoingTransfers(token);
      setOutgoingTransfers(data);
    } catch (err) {
      setError("Gönderilen talepler yüklenemedi.");
    }
  };

  useEffect(() => {
    loadComplaints();
    loadDeletedComplaints();
    loadIncomingTransfers();
    loadOutgoingTransfers();
  }, [token]);

  // Dropdown dışına tıklanınca kapanması için
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus, token);
      loadComplaints();
      loadDeletedComplaints();
      setSelectedComplaint((prev) =>
        prev && prev.id === complaintId ? { ...prev, status: newStatus } : prev
      );
    } catch (err) {
      setError("Durum güncellenemedi.");
    }
  };

  const handleTransferSubmit = async () => {
    if (!transferTarget) return;
    try {
      await createTransfer(selectedComplaint.id, transferTarget, token);
      setTransferTarget("");
      handleCloseModal();
      loadComplaints();
      loadOutgoingTransfers();
    } catch (err) {
      setError("Transfer talebi gönderilemedi.");
    }
  };

  const handleTransferResponse = async (transferId, approve) => {
    try {
      await respondToTransfer(transferId, approve, token);
      loadIncomingTransfers();
      loadOutgoingTransfers();
      loadComplaints();
    } catch (err) {
      setError("Talep işlenemedi.");
    }
  };

  const handleDelete = async (complaintId) => {
    if (!window.confirm("Bu şikayeti silmek istediğinize emin misiniz?")) return;
    try {
      await updateComplaintStatus(complaintId, "silindi", token);
      handleCloseModal();
      loadComplaints();
      loadDeletedComplaints();
    } catch (err) {
      setError("Şikayet silinemedi.");
    }
  };

  const handleRestore = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus, token);
      loadComplaints();
      loadDeletedComplaints();
    } catch (err) {
      setError("Şikayet geri yüklenemedi.");
    }
  };

  const handleImageLoad = (event) => {
    setImageDimensions({
      width: event.target.naturalWidth,
      height: event.target.naturalHeight,
    });
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
    setImageDimensions(null);
    setTransferTarget("");
  };

  const activeComplaints = complaints.filter(
    (c) => c.status === "beklemede" || c.status === "inceleniyor"
  );
  const pastComplaints = complaints.filter(
    (c) => c.status === "cozuldu" || c.status === "reddedildi"
  );

  const stats = {
    total: complaints.length + deletedComplaints.length,
    beklemede: complaints.filter((c) => c.status === "beklemede").length,
    inceleniyor: complaints.filter((c) => c.status === "inceleniyor").length,
    cozuldu: complaints.filter((c) => c.status === "cozuldu").length,
    reddedildi: complaints.filter((c) => c.status === "reddedildi").length,
  };

  const mapCenter =
    activeComplaints.length > 0
      ? [activeComplaints[0].latitude, activeComplaints[0].longitude]
      : [36.983, 35.317];

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Paneli</h1>
        <div className="admin-user-menu" ref={dropdownRef}>
          <button
            id="admin-user-menu-btn"
            className="admin-user-btn"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span className="admin-avatar">{fullName?.charAt(0).toUpperCase()}</span>
            <span className="admin-user-name">Hoş geldiniz, {fullName}</span>
            <span className={`admin-chevron ${dropdownOpen ? "open" : ""}`}>▾</span>
          </button>
          {dropdownOpen && (
            <div className="admin-dropdown">
              <button
                id="change-pw-menu-item"
                className="admin-dropdown-item"
                onClick={() => { setShowChangePw(true); setDropdownOpen(false); }}
              >
                🔑 Şifre Değiştir
              </button>
              <button
                id="logout-menu-item"
                className="admin-dropdown-item admin-dropdown-logout"
                onClick={logout}
              >
                🚪 Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Toplam Şikayet</span>
        </div>
        <div className="stat-card stat-beklemede">
          <span className="stat-value">{stats.beklemede}</span>
          <span className="stat-label">Beklemede</span>
        </div>
        <div className="stat-card stat-inceleniyor">
          <span className="stat-value">{stats.inceleniyor}</span>
          <span className="stat-label">İnceleniyor</span>
        </div>
        <div className="stat-card stat-cozuldu">
          <span className="stat-value">{stats.cozuldu}</span>
          <span className="stat-label">Çözüldü</span>
        </div>
        <div className="stat-card stat-reddedildi">
          <span className="stat-value">{stats.reddedildi}</span>
          <span className="stat-label">Reddedildi</span>
        </div>
      </div>

      {(incomingTransfers.length > 0 || outgoingTransfers.length > 0) && (
        <section className="incoming-transfers">
          <h2>Transfer İşlemleri</h2>
          <div className="transfer-list">
            {incomingTransfers.map((transfer) => (
              <div key={`in-${transfer.id}`} className="transfer-item">
                <span>
                  <strong>Gelen Talep</strong> — Şikayet #{transfer.complaint_id},{" "}
                  {CATEGORY_LABELS[transfer.from_category]} biriminden
                </span>
                <div className="transfer-actions">
                  <button
                    className="transfer-approve"
                    onClick={() => handleTransferResponse(transfer.id, true)}
                  >
                    Onayla
                  </button>
                  <button
                    className="transfer-reject"
                    onClick={() => handleTransferResponse(transfer.id, false)}
                  >
                    Reddet
                  </button>
                </div>
              </div>
            ))}

            {outgoingTransfers.map((transfer) => (
              <div key={`out-${transfer.id}`} className="transfer-item">
                <span>
                  <strong>Gönderilen Talep</strong> — Şikayet #{transfer.complaint_id},{" "}
                  {CATEGORY_LABELS[transfer.to_category]} birimine
                </span>
                <span className="transfer-pending-badge">Beklemede</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="admin-map-wrapper">
        <MapContainer center={mapCenter} zoom={12} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap katkıda bulunanlar"
          />
          {activeComplaints.map((complaint) => (
            <Marker
              key={complaint.id}
              position={[complaint.latitude, complaint.longitude]}
              eventHandlers={{ click: () => setSelectedComplaint(complaint) }}
            />
          ))}
        </MapContainer>
      </div>

      <h2 className="section-title">Aktif Şikayetler</h2>
      <div className="complaint-grid">
        {activeComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="complaint-card"
            onClick={() => setSelectedComplaint(complaint)}
          >
            <div className="complaint-image-wrapper">
              <img
                src={`http://localhost:8000/${complaint.image_path}`}
                alt="Şikayet fotoğrafı"
                className="complaint-image"
              />
              <div className="image-overlay">
                <span>🔍 Büyüt</span>
              </div>
            </div>
            <div className="complaint-info">
              <p className="complaint-meta">
                <strong>{complaint.user.user_full_name}</strong>
              </p>
              <p className={`status-badge status-${complaint.status}`}>
                {STATUS_LABELS[complaint.status]}
              </p>
            </div>
          </div>
        ))}
        {activeComplaints.length === 0 && <p className="empty-text">Aktif şikayet bulunmuyor.</p>}
      </div>

      <h2 className="section-title">Geçmiş Şikayetler</h2>
      <div className="complaint-row-list">
        {pastComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="complaint-row"
            onClick={() => setSelectedComplaint(complaint)}
          >
            <img
              src={`http://localhost:8000/${complaint.image_path}`}
              alt="Şikayet fotoğrafı"
              className="row-thumbnail"
            />
            <span className="row-name">{complaint.user.user_full_name}</span>
            <span className="row-description">{complaint.description || "—"}</span>
            <span className={`status-badge status-${complaint.status}`}>
              {STATUS_LABELS[complaint.status]}
            </span>
          </div>
        ))}
        {pastComplaints.length === 0 && <p className="empty-text">Geçmiş şikayet bulunmuyor.</p>}
      </div>

      <h2 className="section-title">Silinen Şikayetler</h2>
      <div className="complaint-row-list">
        {deletedComplaints.map((complaint) => (
          <div key={complaint.id} className="complaint-row">
            <img
              src={`http://localhost:8000/${complaint.image_path}`}
              alt="Şikayet fotoğrafı"
              className="row-thumbnail"
            />
            <span className="row-name">{complaint.user.user_full_name}</span>
            <span className="row-description">{complaint.description || "—"}</span>
            <select
              value={complaint.status}
              onChange={(e) => handleRestore(complaint.id, e.target.value)}
              className="row-restore-select"
            >
              <option value="silindi">Silindi</option>
              <option value="beklemede">Beklemede olarak geri yükle</option>
              <option value="inceleniyor">İnceleniyor olarak geri yükle</option>
            </select>
          </div>
        ))}
        {deletedComplaints.length === 0 && <p className="empty-text">Silinen şikayet bulunmuyor.</p>}
      </div>

      {selectedComplaint && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <img
              src={`http://localhost:8000/${selectedComplaint.image_path}`}
              alt="Şikayet fotoğrafı"
              className="modal-image"
              onLoad={handleImageLoad}
            />
            {imageDimensions && (
              <span className="image-dimensions">
                {imageDimensions.width} × {imageDimensions.height} px
              </span>
            )}
            <div className="modal-info">
              <p><strong>Ad Soyad:</strong> {selectedComplaint.user.user_full_name}</p>
              <p><strong>Telefon Numarası: </strong>{selectedComplaint.user.user_phone_number}</p>
              <p><strong>TC Kimlik No: </strong>{selectedComplaint.user.tc_kimlik_no}</p>
              <p><strong>Şikayet Açıklaması: </strong> {selectedComplaint.description || "Açıklama girilmemiş"}</p>
              <p>Güven skoru: %{Math.round(selectedComplaint.confidence_score * 100)}</p>

              <select
                value={selectedComplaint.status}
                onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value)}
                className={`status-select status-${selectedComplaint.status}`}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <div className="transfer-section">
                <label className="section-label">Yanlış kategoriye mi düştü?</label>
                <div className="transfer-form">
                  <select
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                  >
                    <option value="">Kategori seçin...</option>
                    {Object.entries(CATEGORY_LABELS)
                      .filter(([value]) => value !== selectedComplaint.category)
                      .map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                  </select>
                  <button onClick={handleTransferSubmit} disabled={!transferTarget}>
                    Transfer Et
                  </button>
                </div>
              </div>

              <button className="delete-button" onClick={() => handleDelete(selectedComplaint.id)}>
                🗑 Şikayeti Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePw && (
        <ChangePasswordModal onClose={() => setShowChangePw(false)} />
      )}
    </div>
  );
}

export default AdminPanel;