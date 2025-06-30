// src/pages/authentication/validate-registration/ValidateRegistrationPage.jsx
import { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Loader from "../../../../@zenidata/components/UI/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import AppLogo from "../../../../@zenidata/components/AppLogo";

function ValidateRegistrationPage() {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("auth");
  const { validateRegistration, isAuthenticated, alertMessage } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // Récupérer l'email depuis l'état de la navigation
  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      // Si l'email n'est pas disponible, rediriger vers la page d'inscription
      navigate("/register");
    }
    if (isAuthenticated) {
      navigate("/");
    }
  }, [email, navigate, isAuthenticated]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await validateRegistration(email, code);
      // setSuccessMessage(t(`register.accountValidated`));
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
  return (
    // <div className="validate-registration-page">
    //   <form className="validate-registration-form" onSubmit={handleSubmit}>
    // <h2>{t("validateRegistration.title")}</h2>
    // <p>{t("validateRegistration.instructions")}</p>
    // {error && <div className="error-message">{error}</div>}
    // {successMessage && (
    //   <div className="success-message">{successMessage}</div>
    // )}
    //     <div className="form-group">
    //       <label htmlFor="code">{t("validateRegistration.code")}</label>
    //       <input
    //         type="text"
    //         id="code"
    // value={code}
    // onChange={(e) => setCode(e.target.value)}
    // placeholder={t("validateRegistration.codePlaceholder")}
    //         required
    //       />
    //     </div>
    //     <button type="submit" className="submit-button" disabled={loading}>
    //       {/* {loading
    //         ? t("validateRegistration.validating")
    //         : t("validateRegistration.submit")} */}

    //       {loading ? <Loader /> : t("validateRegistration.submit")}
    //     </button>
    //     {/* Ajout du lien vers le formulaire de login */}
    //     <div className="additional-links">
    //       <Link to="/login" className="login-link">
    //         {t("validateRegistration.backToLogin")}
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
            <h1>{t("validateRegistration.title")}</h1>
            <p className="iz_form-desc">
              {t("validateRegistration.instructions")}
            </p>

            {/* {error && <div className="error-message">{error}</div>} */}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            {alertMessage && (
              <div className="error-message">
                {tCore(`errorMessages.${alertMessage?.content}`)}
              </div>
            )}

            <div className="iz_field">
              <label htmlFor="code">{t("validateRegistration.code")}</label>
              <input
                // placeholder="john.doe@gmail.com"
                className="iz_input-text"
                type="text"
                id="email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("validateRegistration.codePlaceholder")}
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
export default ValidateRegistrationPage;
