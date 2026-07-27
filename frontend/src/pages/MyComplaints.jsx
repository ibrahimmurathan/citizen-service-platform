import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyComplaints } from "../services/api";
import "./MyComplaints.css";

const STATUS_LABELS = {
    beklemede: "Beklemede",
    inceleniyor: "İnceleniyor",
    cozuldu: "Çözüldü",
    reddedildi: "Reddedildi",
};

function MyComplaints() {
    const { token } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMyComplaints(token);
                setComplaints(data);
            } catch (err) {
                setError("Şikayetleriniz yüklenemedi.");
            }
        }
        fetchData();
    }, [token]);

    return (
        <div className="my-complaints-page">
            <h1 className="page-title">Geçmiş Başvurularım</h1>

            {error && <p className="error-text">{error}</p>}

            {complaints.length === 0 && !error && (
                <p className="empty-text">Henüz bir başvurunuz bulunmuyor.</p>
            )}

            <div className="complaint-grid">
                {complaints.map((complaint) => (
                    <div key={complaint.id} className="complaint-card">
                        <img
                            src={`http://localhost:8000/${complaint.image_path}`}
                            alt="Şikayet fotoğrafı"
                            className="complaint-image"
                        />
                        <div className="complaint-info">
                            <p className="tracking-code">Takip No: {complaint.tracking_code}</p>
                            <p className={`status-badge status-${complaint.status}`}>
                                {STATUS_LABELS[complaint.status]}
                            </p>
                            <p className="complaint-description">
                                {complaint.description || "Açıklama girilmemiş"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyComplaints;