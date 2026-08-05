import { useState } from "react";
import { changeEmail } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ChangeEmailModal({ onClose }) {
  const { token } = useAuth();
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const emailsMatch = newEmail === confirmEmail;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);

  const canSubmit =
    password.trim() &&
    isValidEmail &&
    emailsMatch &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await changeEmail(password, newEmail, token);
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
          <span className="change-pw-icon">✉️</span>
          <h2 className="change-pw-title">E-posta Değiştir</h2>
        </div>

        {success ? (
          <div className="change-pw-success">
            <span className="change-pw-success-icon">✅</span>
            <p>E-posta adresiniz başarıyla değiştirildi!</p>
          </div>
        ) : (
          <form className="change-pw-form" onSubmit={handleSubmit}>
            {/* Şifre Doğrulama */}
            <div className="change-pw-field">
              <label htmlFor="email-verify-password">Mevcut Şifreniz</label>
              <div className="change-pw-input-wrap">
                <input
                  id="email-verify-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kimliğinizi doğrulamak için"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? "🔓" : "🔒"}
                </button>
              </div>
            </div>

            {/* Yeni E-posta */}
            <div className="change-pw-field">
              <label htmlFor="new-email">Yeni E-posta Adresi</label>
              <div className="change-pw-input-wrap">
                <input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="yeni@eposta.com"
                  autoComplete="email"
                  className={
                    newEmail && !isValidEmail ? "input-error" : ""
                  }
                />
              </div>
              {newEmail && !isValidEmail && (
                <span className="field-error-msg">Geçerli bir e-posta girin</span>
              )}
            </div>

            {/* Yeni E-posta Tekrar */}
            <div className="change-pw-field">
              <label htmlFor="confirm-email">Yeni E-posta Tekrar</label>
              <div className="change-pw-input-wrap">
                <input
                  id="confirm-email"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="E-postanızı tekrar girin"
                  autoComplete="email"
                  className={
                    confirmEmail && !emailsMatch ? "input-error" : ""
                  }
                />
              </div>
              {confirmEmail && !emailsMatch && (
                <span className="field-error-msg">E-posta adresleri eşleşmiyor</span>
              )}
            </div>

            {error && <p className="change-pw-error">{error}</p>}

            <button
              type="submit"
              className="change-pw-submit"
              disabled={!canSubmit}
            >
              {loading ? "Kaydediliyor…" : "E-postayı Kaydet"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChangeEmailModal;
