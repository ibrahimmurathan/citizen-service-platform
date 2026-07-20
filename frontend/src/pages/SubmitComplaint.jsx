import { useState } from "react";
import PhotoUpload from "../components/PhotoUpload";
import ComplaintForm from "../components/ComplaintForm";
import LocationPicker from "../components/LocationPicker";

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

  const handleSubmit = async () => {
    if (!file || !formData.fullName || !formData.phoneNumber || !location) {
      setSubmitStatus("Lütfen fotoğraf, ad-soyad, telefon ve konum bilgilerini eksiksiz doldurun.");
      return;
    }

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
      setSubmitStatus("Şikayetiniz başarıyla gönderildi! ID: " + result.id);
    } catch (error) {
      setSubmitStatus("Bir hata oluştu, lütfen tekrar deneyin.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Şikayet Bildir</h2>
      <PhotoUpload onFileSelect={setFile} />
      <ComplaintForm onFormChange={setFormData} />
      <LocationPicker onLocationChange={setLocation} />
      <button onClick={handleSubmit}>Gönder</button>
      {submitStatus && <p>{submitStatus}</p>}
    </div>
  );
}

export default SubmitComplaint;