// src/pages/authentication/forgot-password/ForgotPasswordPage.jsx
import { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../../../@zenidata/components/UI/Loader";
import AppLogo from "../../../../@zenidata/components/AppLogo";

function ForgotPasswordPage() {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("auth");
  const { isAuthenticated, forgotPassword, alertMessage } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    setApiMessage("");
    try {
      const response = await forgotPassword(email);
      // setApiMessage(t(`api_messages.${response.api_message}`));
      // Rediriger vers la page de vérification du code après succès
      navigate("/verify-code", { state: { email } });
    } catch (err) {
      // L'erreur est gérée dans AuthContext et mappée via authError
      setLocalError(
        t(`api_messages.${alertMessage.content}`) ||
          t("api_messages.generic_error")
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    // <div className="forgot-password-page">
    //   <form className="forgot-password-form" onSubmit={handleSubmit}>
    //     <h2>{t("forgotPassword.title")}</h2>
    // {localError && <div className="error-message">{localError}</div>}
    // {apiMessage && <div className="success-message">{apiMessage}</div>}
    //     <div className="form-group">
    //       <label htmlFor="email">{t("forgotPassword.email")}</label>
    //       <input
    // type="email"
    // id="email"
    // value={email}
    // onChange={(e) => setEmail(e.target.value)}
    // placeholder={t("forgotPassword.emailPlaceholder")}
    // required
    //       />
    //     </div>
    //     <button type="submit" className="submit-button" disabled={loading}>
    //       {/* {loading ? t("forgotPassword.sending") : t("forgotPassword.submit")} */}

    //       {loading ? <Loader /> : t("forgotPassword.submit")}
    //     </button>
    //     {/* Ajout du lien vers le formulaire de login */}
    //     <div className="additional-links">
    //       <Link to="/login" className="login-link">
    //         {t("forgotPassword.backToLogin")}
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
          <div className="iz_back-link">
            <Link to="/login" title="Back to login">
              {t("backToLogin")}
            </Link>
          </div>
          <form action="" name="" onSubmit={handleSubmit}>
            {localError && <div className="error-message">{localError}</div>}
            {/* {apiMessage && <div className="success-message">{apiMessage}</div>} */}
            {alertMessage && (
              <div className="error-message">
                {tCore(`errorMessages.${alertMessage?.content}`)}
              </div>
            )}

            <h1>{t("forgotPassword.title")}</h1>
            {/* <p className="iz_form-desc">Sub text goes here</p> */}
            <div className="iz_field">
              <label>{t("forgotPassword.email")}</label>
              <input
                // placeholder="john.doe@gmail.com"
                className="iz_input-text"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("forgotPassword.emailPlaceholder")}
                required
              />
            </div>
            <div className="iz_field">
              <button className="iz_btn-submit iz_btn-primary">
                {loading ? <Loader /> : t("forgotPassword.submit")}
                {/* Submit */}
              </button>
            </div>
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
export default ForgotPasswordPage;
