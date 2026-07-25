const API_BASE = "http://localhost:8000";

export async function registerUser(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Kayıt başarısız");
  return response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Giriş başarısız");
  return response.json();
}

export async function submitComplaint(formDataObj, token) {
  const response = await fetch(`${API_BASE}/complaints`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formDataObj,
  });
  if (!response.ok) throw new Error("Şikayet gönderilemedi");
  return response.json();
}

export async function getComplaints(token) {
  const response = await fetch(`${API_BASE}/complaints`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Şikayetler alınamadı");
  return response.json();
}

export async function updateComplaintStatus(complaintId, newStatus, token) {
  const response = await fetch(`${API_BASE}/complaints/${complaintId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) throw new Error("Durum güncellenemedi");
  return response.json();
}