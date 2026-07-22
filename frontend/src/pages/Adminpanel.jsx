import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getComplaints } from "../services/api";

function AdminPanel() {
  const { token, fullName } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const data = await getComplaints(token);
        setComplaints(data);
      } catch (err) {
        setError("Şikayetler yüklenemedi.");
      }
    }
    fetchComplaints();
  }, [token]);

  return (
    <div>
      <h1>Admin Paneli</h1>
      <p>Hoş geldiniz, {fullName}</p>

      {error && <p>{error}</p>}

      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id}>
            <strong>{complaint.predicted_category}</strong> — {complaint.status}
            <br />
            {complaint.user.user_full_name} ({complaint.user.user_phone_number})
            <br />
            {complaint.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;