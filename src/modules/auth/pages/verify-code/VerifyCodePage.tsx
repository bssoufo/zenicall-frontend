// src/pages/authentication/verify-code/VerifyCodePage.jsx
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { handleAxiosError } from "../../../../@zenidata/api/ApiClient";
import { verifyCodeService } from "../../authService";
import Loader from "../../../../@zenidata/components/UI/Loader";
import getErrorMessageFromCode from "../../../../core/constants/ErrorHandling";
import AppLogo from "../../../../@zenidata/components/AppLogo";

function VerifyCodePage() {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  // Récupérer l'email depuis l'état de la navigation
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!email) {
      // Si l'email n'est pas disponible, rediriger vers la page de demande
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      await verifyCodeService(email, code);
      // Code validé, rediriger vers la page de réinitialisation du mot de passe
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      const errorMessage = error.response?.data.error_key;
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    // <div className="verify-code-page">
    //   <form className="verify-code-form" onSubmit={handleSubmit}>
    //     <h2>{t("verifyCode.title")}</h2>
    //     <p>{t("verifyCode.instructions")}</p>
    //     {error && <div className="error-message">{error}</div>}
    //     <div className="form-group">
    //       <label htmlFor="code">{t("verifyCode.code")}</label>
    //       <input
    //         type="text"
    //         id="code"
    //         value={code}
    //         onChange={(e) => setCode(e.target.value)}
    //         placeholder={t("verifyCode.codePlaceholder")}
    //         required
    //       />
    //     </div>
    //     <button type="submit" className="submit-button" disabled={loading}>
    //       {loading ? t("verifyCode.verifying") : t("verifyCode.submit")}
    //     </button>
    //     {/* Ajout du lien vers le formulaire de login */}
    //     <div className="additional-links">
    //       <Link to="/login" className="login-link">
    //         {t("verifyCode.backToLogin")}
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
          <form action="" name="" onSubmit={handleSubmit}>
            {/* {alertMessage && (
              <div className="error-message">{alertMessage.content}</div>
            )} */}
            <h1>{t("verifyCode.title")}</h1>
            <p className="iz_form-desc">{t("verifyCode.code")}</p>
            {/* {error && <div className="error-message">{error}</div>} */}
            {errorMessage && (
              <div className="error-message">
                {tCore(`errorMessages.${errorMessage}`)}
              </div>
            )}

            <div className="iz_field">
              <label>Code</label>
              <input
                // placeholder="john.doe@gmail.com"
                className="iz_input-text"
                type="text"
                id="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("verifyCode.codePlaceholder")}
                required
              />
            </div>

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
              <Link to="/login" title="Sign up" className="m_link-signup">
                {t("verifyCode.backToLogin")}
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
        <img alt="" src="assets/img/img-rafiki.png" />
      </div>
    </>
  );
}
export default VerifyCodePage;
