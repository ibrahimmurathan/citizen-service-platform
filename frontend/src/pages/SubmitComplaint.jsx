import { useState } from "react";
import PhotoUpload from "../components/PhotoUpload";
import LocationPicker from "../components/LocationPicker";
import { submitComplaint } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./SubmitComplaint.css";

function SubmitComplaint() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [statusType, setStatusType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const { token } = useAuth();

  const handleSubmit = async () => {
    if (!token) {
      setSubmitStatus("Şikayet gönderebilmek için giriş yapmalısınız.");
      setStatusType("error");
      return;
    }
    if (!file || !location) {
      setSubmitStatus("Lütfen fotoğraf ve konum bilgilerini eksiksiz doldurun.");
      setStatusType("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const data = new FormData();
    data.append("file", file);
    data.append("description", description);
    data.append("latitude", location.latitude);
    data.append("longitude", location.longitude);

    try {
      const result = await submitComplaint(data, token);
      setSubmitStatus("Şikayetiniz başarıyla gönderildi! Takip numaranız: " + result.tracking_code);
      setStatusType("success");

      setFile(null);
      setDescription("");
      setLocation(null);
      setResetKey((prev) => prev + 1);
    } catch (error) {
      setSubmitStatus("Bir hata oluştu, lütfen tekrar deneyin.");
      setStatusType("error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="submit-card">
        <h1 className="submit-title">Şikayet Bildir</h1>
        <p className="submit-subtitle">
          Şehrimizle ilgili sorunları fotoğraflayarak bize iletin, ilgili birime yönlendirelim.
        </p>

        <div className="submit-section">
          <label className="section-label">1. Fotoğraf</label>
          <PhotoUpload key={`photo-${resetKey}`} onFileSelect={setFile} />
        </div>

        <div className="submit-section">
          <label className="section-label">2. Açıklama (opsiyonel)</label>
          <textarea
            className="description-input"
            placeholder="Sorunla ilgili kısa bir açıklama yazabilirsiniz..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="submit-section">
          <label className="section-label">3. Konum</label>
          <LocationPicker key={`location-${resetKey}`} onLocationChange={setLocation} />
        </div>

        <button onClick={handleSubmit} disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Gönderiliyor..." : "Şikayeti Gönder"}
        </button>

        {submitStatus && (
          <p className={statusType === "success" ? "status-success" : "status-error"}>
            {submitStatus}
          </p>
        )}
      </div>
    </div>
  );
}

export default SubmitComplaint;