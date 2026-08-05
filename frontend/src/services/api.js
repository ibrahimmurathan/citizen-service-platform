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

export async function getComplaints(token, status = null) {
  const url = status
    ? `${API_BASE}/complaints?status=${status}`
    : `${API_BASE}/complaints`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
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

export async function getMyComplaints(token) {
  const response = await fetch(`${API_BASE}/complaints/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Şikayetleriniz alınamadı");
  return response.json();
}

export async function createTransfer(complaintId, toCategory, token) {
  const response = await fetch(`${API_BASE}/transfers/${complaintId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to_category: toCategory }),
  });
  if (!response.ok) throw new Error("Transfer talebi gönderilemedi");
  return response.json();
}

export async function getIncomingTransfers(token) {
  const response = await fetch(`${API_BASE}/transfers/incoming`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Transfer talepleri alınamadı");
  return response.json();
}

export async function respondToTransfer(transferId, approve, token) {
  const response = await fetch(`${API_BASE}/transfers/${transferId}/respond`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ approve }),
  });
  if (!response.ok) throw new Error("Talep işlenemedi");
  return response.json();
}

export async function getOutgoingTransfers(token) {
  const response = await fetch(`${API_BASE}/transfers/outgoing`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Gönderilen talepler alınamadı");
  return response.json();
}

export async function trackComplaint(trackingCode) {
  const response = await fetch(`${API_BASE}/complaints/track/${trackingCode}`);
  if (!response.ok) throw new Error("Şikayet bulunamadı");
  return response.json();
}

export async function changePassword(currentPassword, newPassword, token) {
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Şifre değiştirilemedi");
  }
  return response.json();
}

export async function changeEmail(password, newEmail, token) {
  const response = await fetch(`${API_BASE}/auth/change-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password, new_email: newEmail }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "E-posta değiştirilemedi");
  }
  return response.json();
}