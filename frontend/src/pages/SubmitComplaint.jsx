import { useState } from "react";
import PhotoUpload from "../components/PhotoUpload";
import LocationPicker from "../components/LocationPicker";
import { submitComplaint } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
      setSubmitStatus("Şikayetiniz başarıyla gönderildi! Takip numaranız: " + result.id);
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
    <div className="submit-complaint">
      <h2>Şikayet Bildir</h2>

      <div className="form-section">
        <PhotoUpload key={`photo-${resetKey}`} onFileSelect={setFile} />
      </div>

      <div className="form-section">
        <textarea
          placeholder="Açıklama (opsiyonel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-section">
        <LocationPicker key={`location-${resetKey}`} onLocationChange={setLocation} />
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting} className="submit-button">
        {isSubmitting ? "Gönderiliyor..." : "Gönder"}
      </button>

      {submitStatus && (
        <p className={statusType === "success" ? "status-success" : "status-error"}>
          {submitStatus}
        </p>
      )}
    </div>
  );
}

export default SubmitComplaint;