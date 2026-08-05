import { useState } from "react";
import { changePassword } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ChangePasswordModal({ onClose }) {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    currentPassword.trim() &&
    newPassword.trim().length >= 6 &&
    passwordsMatch &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, token);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card change-pw-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="change-pw-header">
          <span className="change-pw-icon">🔑</span>
          <h2 className="change-pw-title">Şifre Değiştir</h2>
        </div>

        {success ? (
          <div className="change-pw-success">
            <span className="change-pw-success-icon">✅</span>
            <p>Şifreniz başarıyla değiştirildi!</p>
          </div>
        ) : (
          <form className="change-pw-form" onSubmit={handleSubmit}>
            {/* Mevcut Şifre */}
            <div className="change-pw-field">
              <label htmlFor="current-password">Mevcut Şifre</label>
              <div className="change-pw-input-wrap">
                <input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut şifrenizi girin"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowCurrent((v) => !v)}
                  tabIndex={-1}
                >
                  {showCurrent ? "🔓" : "🔒"}
                </button>
              </div>
            </div>

            {/* Yeni Şifre */}
            <div className="change-pw-field">
              <label htmlFor="new-password">Yeni Şifre</label>
              <div className="change-pw-input-wrap">
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowNew((v) => !v)}
                  tabIndex={-1}
                >
                  {showNew ? "🔓" : "🔒"}
                </button>
              </div>
            </div>

            {/* Yeni Şifre Tekrar */}
            <div className="change-pw-field">
              <label htmlFor="confirm-password">Yeni Şifre Tekrar</label>
              <div className="change-pw-input-wrap">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yeni şifrenizi tekrar girin"
                  autoComplete="new-password"
                  className={
                    confirmPassword && !passwordsMatch ? "input-error" : ""
                  }
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? "🔓" : "🔒"}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <span className="field-error-msg">Şifreler eşleşmiyor</span>
              )}
            </div>

            {error && <p className="change-pw-error">{error}</p>}

            <button
              type="submit"
              className="change-pw-submit"
              disabled={!canSubmit}
            >
              {loading ? "Kaydediliyor…" : "Şifreyi Kaydet"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChangePasswordModal;
