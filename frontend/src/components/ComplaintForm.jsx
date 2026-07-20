import { useState } from "react";

function ComplaintForm({ onFormChange }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    description: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    onFormChange(updatedData);
  };

  return (
    <div>
      <input
        type="text"
        name="fullName"
        placeholder="Ad Soyad"
        value={formData.fullName}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Telefon"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email (opsiyonel)"
        value={formData.email}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Açıklama (opsiyonel)"
        value={formData.description}
        onChange={handleChange}
      />
    </div>
  );
}

export default ComplaintForm;