import { useState } from "react";
import { trackComplaint } from "../services/api";
import "./TrackComplaint.css";

const STATUS_LABELS = {
    beklemede: "Beklemede",
    inceleniyor: "İnceleniyor",
    cozuldu: "Çözüldü",
    reddedildi: "Reddedildi",
    silindi: "Silindi",
};

function TrackComplaint() {
    const [trackingCode, setTrackingCode] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (event) => {
        event.preventDefault();
        setError(null);
        setResult(null);
        setIsSearching(true);
        try {
            const data = await trackComplaint(trackingCode.trim());
            setResult(data);
        } catch (err) {
            setError("Bu takip numarasıyla bir şikayet bulunamadı.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="track-page">
            <div className="track-card">
                <h1 className="track-title">Şikayetimi Sorgula</h1>
                <p className="track-subtitle">
                    Şikayet oluştururken size verilen takip numarasını girin.
                </p>

                <form onSubmit={handleSearch} className="track-form">
                    <input
                        className="track-input"
                        placeholder="Örn: A3f9K2pQ"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                    />
                    <button type="submit" className="track-button" disabled={isSearching || !trackingCode}>
                        {isSearching ? "Aranıyor..." : "Sorgula"}
                    </button>
                </form>

                {error && <p className="status-error">{error}</p>}

                {result && (
                    <div className="track-result">
                        <img
                            src={`http://localhost:8000/${result.image_path}`}
                            alt="Şikayet fotoğrafı"
                            className="track-result-image"
                        />
                        <p className={`status-badge status-${result.status}`}>
                            {STATUS_LABELS[result.status]}
                        </p>
                        <p className="track-result-description">
                            {result.description || "Açıklama girilmemiş"}
                        </p>
                        <p className="track-result-date">
                            Oluşturulma: {new Date(result.created_at).toLocaleDateString("tr-TR")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrackComplaint;