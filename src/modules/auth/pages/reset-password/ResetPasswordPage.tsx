// src/pages/authentication/reset-password/ResetPasswordPage.jsx
import { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";

import Loader from "../../../../@zenidata/components/UI/Loader";
import { handleAxiosError } from "../../../../@zenidata/api/ApiClient";
import { resetPasswordService } from "../../authService";
import AppLogo from "../../../../@zenidata/components/AppLogo";

function ResetPasswordPage() {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  // Récupérer l'email depuis l'état de la navigation
  const email = location.state?.email || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!email) {
      // Si l'email n'est pas disponible, rediriger vers la page de demande
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const validatePassword = (password: string) => {
    // Règles de validation du mot de passe
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (password.length < minLength) {
      return t("resetPassword.criteria.minLength", { count: minLength });
    }
    if (!hasUpperCase) {
      return t("resetPassword.criteria.uppercase");
    }
    if (!hasLowerCase) {
      return t("resetPassword.criteria.lowercase");
    }
    if (!hasNumbers) {
      return t("resetPassword.criteria.number");
    }
    if (!hasSpecialChar) {
      return t("resetPassword.criteria.specialChar");
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");
    setApiError("");
    setSuccessMessage("");
    // Validation des mots de passe
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError(t("resetPassword.criteria.passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      await resetPasswordService(email, newPassword);
      // setSuccessMessage(t(`api_messages.${response.api_message}`));
      // Rediriger vers la page de login après succès
      // setTimeout(() => {
      navigate("/login");
      // }, 3000); // Attendre 3 secondes avant la redirection
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Fonction pour vérifier les critères de mot de passe
  const getPasswordCriteria = () => {
    return {
      minLength: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };
  };

  const criteria = getPasswordCriteria();

  return (
    // <div className="reset-password-page">
    //   <form className="reset-password-form" onSubmit={handleSubmit}>
    //     <h2>{t("resetPassword.title")}</h2>
    // <p>{t("resetPassword.instructions")}</p>
    // {/* Ajout des critères de mot de passe avec coche verte */}
    // <div className="password-criteria">
    //   <h4>{t("resetPassword.passwordCriteriaTitle")}</h4>
    //   <ul>
    //     <li className={criteria.minLength ? "met" : ""}>
    //       {criteria.minLength && <span className="checkmark">✔️</span>}
    //       {t("resetPassword.criteria.minLength", { count: 8 })}
    //     </li>
    //     <li className={criteria.uppercase ? "met" : ""}>
    //       {criteria.uppercase && <span className="checkmark">✔️</span>}
    //       {t("resetPassword.criteria.uppercase")}
    //     </li>
    //     <li className={criteria.lowercase ? "met" : ""}>
    //       {criteria.lowercase && <span className="checkmark">✔️</span>}
    //       {t("resetPassword.criteria.lowercase")}
    //     </li>
    //     <li className={criteria.number ? "met" : ""}>
    //       {criteria.number && <span className="checkmark">✔️</span>}
    //       {t("resetPassword.criteria.number")}
    //     </li>
    //     <li className={criteria.specialChar ? "met" : ""}>
    //       {criteria.specialChar && <span className="checkmark">✔️</span>}
    //       {t("resetPassword.criteria.specialChar")}
    //     </li>
    //   </ul>
    // </div>
    //     {apiError && <div className="error-message">{apiError}</div>}
    //     {successMessage && (
    //       <div className="success-message">{successMessage}</div>
    //     )}
    //     <div className="form-group">
    //       <label htmlFor="newPassword">{t("resetPassword.newPassword")}</label>
    //       <input
    //         type="password"
    //         id="newPassword"
    // value={newPassword}
    // onChange={(e) => setNewPassword(e.target.value)}
    // placeholder={t("resetPassword.newPasswordPlaceholder")}
    //         required
    //       />
    //       {passwordError && <div className="error-text">{passwordError}</div>}
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="confirmPassword">
    //         {t("resetPassword.confirmPassword")}
    //       </label>
    //       <input
    //         type="password"
    //         id="confirmPassword"
    // value={confirmPassword}
    // onChange={(e) => setConfirmPassword(e.target.value)}
    // placeholder={t("resetPassword.confirmPasswordPlaceholder")}
    //         required
    //       />
    //       {confirmError && <div className="error-text">{confirmError}</div>}
    //     </div>
    //     <button type="submit" className="submit-button" disabled={loading}>
    //       {/* {loading ? t("resetPassword.resetting") : t("resetPassword.submit")} */}

    //       {loading ? <Loader /> : t("resetPassword.submit")}
    //     </button>
    //     {/* Ajout du lien vers le formulaire de login */}
    //     <div className="additional-links">
    //       <Link to="/login" className="login-link">
    //         {t("resetPassword.backToLogin")}
    //       </Link>
    //     </div>
    //   </form>
    // </div>
    <>
      <div className="iz_box-form-content">
        <Link
          style={{ color: "inherit", textDecoration: "none" }}
          to="/login"
          className="m_logo-box">
          <AppLogo />
        </Link>

        <div className="iz_form-box">
          <form style={{ paddingBottom: "4rem" }} onSubmit={handleSubmit}>
            {/* {alertMessage && (
          <div className="error-message">{alertMessage.content}</div>
        )} */}
            <h1>{t("resetPassword.title")}</h1>

            {errorMessage && (
              <div className="error-message">
                {tCore(`errorMessages.${errorMessage}`)}
              </div>
            )}

            <p>{t("resetPassword.instructions")}</p>
            <div className="password-criteria">
              <h4>{t("resetPassword.passwordCriteriaTitle")}</h4>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                <li className={criteria.minLength ? "met" : ""}>
                  {criteria.minLength && <span className="checkmark">✔️</span>}
                  {t("resetPassword.criteria.minLength", { count: 8 })}
                </li>
                <li className={criteria.uppercase ? "met" : ""}>
                  {criteria.uppercase && <span className="checkmark">✔️</span>}
                  {t("resetPassword.criteria.uppercase")}
                </li>
                <li className={criteria.lowercase ? "met" : ""}>
                  {criteria.lowercase && <span className="checkmark">✔️</span>}
                  {t("resetPassword.criteria.lowercase")}
                </li>
                <li className={criteria.number ? "met" : ""}>
                  {criteria.number && <span className="checkmark">✔️</span>}
                  {t("resetPassword.criteria.number")}
                </li>
                <li className={criteria.specialChar ? "met" : ""}>
                  {criteria.specialChar && (
                    <span className="checkmark">✔️</span>
                  )}
                  {t("resetPassword.criteria.specialChar")}
                </li>
              </ul>
            </div>

            <div className="iz_field">
              <label htmlFor="newPassword">
                {t("resetPassword.newPassword")}
              </label>
              <input
                className="iz_input-password"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("resetPassword.newPasswordPlaceholder")}
                required
              />
            </div>

            <div className="iz_field">
              <label htmlFor="">{t("resetPassword.confirmPassword")}</label>
              <input
                className="iz_input-password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                required
              />
            </div>
            {/* <div className="iz_fields iz_flex">
              <div className="iz_field iz_field-checkbox">
                <input type="checkbox" id="iz_field-check-remember" />
                <label htmlFor="iz_field-check-remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="iz_link-forget-pass">
                Forgot Password
              </Link>
            </div> */}
            <div className="iz_field">
              <button
                type="submit"
                disabled={loading}
                className="iz_btn-submit iz_btn-primary">
                {/* Login */}
                {loading ? <Loader /> : t("login.submit")}
              </button>
            </div>
            <p className="iz_text-signup iz_center">
              {t("resetPassword.dontHaveAccount")}{" "}
              <Link to="/register" title="Sign up" className="m_link-signup">
                {t("register.title")}
              </Link>
            </p>
          </form>
        </div>

        {/* <div className="iz_social-pass">
      <div className="iz_social-pass-title iz_center iz_position-relative">
        <span>Or login with</span>
      </div>
      <div className="iz_btn-connect">
        <button
          type="button"
          className="iz_btn-facebook iz_btn-white"></button>
        <button
          type="button"
          className="iz_btn-google iz_btn-white"></button>
        <button
          type="button"
          className="iz_btn-apple iz_btn-white"></button>
      </div>
    </div> */}
      </div>
      <div className="iz-box-form-thumb">
        <img alt="" src="assets/img/forgot-password.png" />
      </div>
    </>
  );
}
export default ResetPasswordPage;
