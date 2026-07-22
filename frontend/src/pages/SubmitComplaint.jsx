import { useState } from "react";
import PhotoUpload from "../components/PhotoUpload";
import ComplaintForm from "../components/ComplaintForm";
import LocationPicker from "../components/LocationPicker";
import "./SubmitComplaint.css";

function SubmitComplaint() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    description: "",
  });
  const [location, setLocation] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [statusType, setStatusType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async () => {
    if (!file || !formData.fullName || !formData.phoneNumber || !location) {
      setSubmitStatus("Lütfen fotoğraf, ad-soyad, telefon ve konum bilgilerini eksiksiz doldurun.");
      setStatusType("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const data = new FormData();
    data.append("file", file);
    data.append("full_name", formData.fullName);
    data.append("phone_number", formData.phoneNumber);
    data.append("email", formData.email);
    data.append("description", formData.description);
    data.append("latitude", location.latitude);
    data.append("longitude", location.longitude);

    try {
      const response = await fetch("http://localhost:8000/complaints", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Sunucu hatası");
      }

      const result = await response.json();
      setSubmitStatus("Şikayetiniz başarıyla gönderildi! Takip numaranız: " + result.id);
      setStatusType("success");

      // Formu ve alt component'leri sıfırla
      setFile(null);
      setFormData({ fullName: "", phoneNumber: "", email: "", description: "" });
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
        <ComplaintForm key={`form-${resetKey}`} onFormChange={setFormData} />
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