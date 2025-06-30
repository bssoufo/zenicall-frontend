// src/pages/authentication/login/LoginPage.jsx
import { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../../../../@zenidata/components/UI/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import AppLogo from "../../../../@zenidata/components/AppLogo";

function LoginPage() {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("auth");
  const { login, isAuthenticated, alertMessage, loading } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Redirige vers le tableau de bord si déjà authentifié

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  /**
   * Gère la soumission du formulaire.
   * @param {Event} e
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    // <div className="login-page">
    //   <form className="login-form" onSubmit={handleSubmit}>
    //     <h2>{t("login.title")}</h2>
    // {authError && <div className="error-message">{authError}</div>}
    //     <div className="form-group">
    //       <label htmlFor="email">{t("login.email")}</label>
    //       <input
    // type="email"
    // id="email"
    // value={email}
    // onChange={(e) => setEmail(e.target.value)}
    // placeholder={t("login.emailPlaceholder")}
    // required
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="password">{t("login.password")}</label>
    //       <input
    // type="password"
    // id="password"
    // value={password}
    // onChange={(e) => setPassword(e.target.value)}
    // placeholder={t("login.passwordPlaceholder")}
    // required
    //       />
    //     </div>
    //     <button type="submit" className="login-button" disabled={loading}>
    //       {/* {loading ? t("login.loading") : t("login.submit")} */}
    //       {loading ? <Loader /> : t("login.submit")}
    //     </button>
    //     <div className="additional-links">
    //       <Link to="/forgot-password" className="forgot-password-link">
    //         {t("login.forgotPassword")}
    //       </Link>
    //       <div className="register-link">
    //         {t("login.noAccount")}{" "}
    //         <Link to="/register">{t("login.register")}</Link>
    //       </div>
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
            {alertMessage && (
              <div className="error-message">
                {tCore(`errorMessages.${alertMessage?.content}`)}
              </div>
            )}
            <h1>{t("login.title")}</h1>
            {/* <p className="iz_form-desc">Login to access your xxx account</p> */}
            <div className="iz_field">
              <label>{t("login.emailPlaceholder")}</label>
              <input
                // placeholder="john.doe@gmail.com"
                className="iz_input-text"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                required
              />
            </div>
            <div className="iz_field">
              <label>{t("login.password")}</label>
              <input
                className="iz_input-password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.passwordPlaceholder")}
                required
              />
            </div>
            <div className="iz_fields iz_flex">
              {/* <div className="iz_field iz_field-checkbox">
                <input type="checkbox" id="iz_field-check-remember" />
                <label htmlFor="iz_field-check-remember">Remember me</label>
              </div> */}
              <Link
                style={{ marginBottom: "0.5rem" }}
                to="/forgot-password"
                className="iz_link-forget-pass">
                {t("login.forgotPassword")}
              </Link>
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
              {t("login.noAccount")}{" "}
              <Link to="/register" title="Sign up" className="m_link-signup">
                {t("login.register")}
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
export default LoginPage;
