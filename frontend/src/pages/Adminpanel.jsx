import { useState, useEffect } from "react";
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
import "leaflet/dist/leaflet.css";
import "./AdminPanel.css";

const STATUS_LABELS = {
  beklemede: "Beklemede",
  inceleniyor: "İnceleniyor",
  cozuldu: "Çözüldü",
  reddedildi: "Reddedildi",
};

const CATEGORY_LABELS = {
  yol_altyapi: "Yol ve Altyapı",
  cevre_atik: "Çevre ve Katı Atık",
  kent_estetik: "Kent Estetiği",
  ulasim_trafik: "Ulaşım ve Trafik",
  yapi_imar: "Yapı ve İmar",
};

function AdminPanel() {
  const { token, fullName, role } = useAuth();
  const [complaints, setComplaints] = useState([]);
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
    loadIncomingTransfers();
    loadOutgoingTransfers();
  }, [token]);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus, token);
      loadComplaints();
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

  const mapCenter =
    complaints.length > 0
      ? [complaints[0].latitude, complaints[0].longitude]
      : [36.983, 35.317];

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Paneli</h1>
        <span>Hoş geldiniz, {fullName}</span>
      </header>

      {error && <p className="error-text">{error}</p>}

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
          {complaints.map((complaint) => (
            <Marker
              key={complaint.id}
              position={[complaint.latitude, complaint.longitude]}
              eventHandlers={{ click: () => setSelectedComplaint(complaint) }}
            />
          ))}
        </MapContainer>
      </div>

      <div className="complaint-grid">
        {complaints.map((complaint) => (
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
              <p><strong>{selectedComplaint.user.user_full_name}</strong> — {selectedComplaint.user.user_phone_number}</p>
              <p>{selectedComplaint.description || "Açıklama girilmemiş"}</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;