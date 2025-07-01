// src/pages/authentication/register/RegisterPage.jsx
import { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../../../../@zenidata/components/UI/Loader";
import { AuthContext } from "../../contexts/AuthContext";
import useResetOnNavigation from "../../hooks/useResetOnNavigation";
import AppLogo from "../../../../@zenidata/components/AppLogo";
import LanguageSwitcher from "../../../../@zenidata/components/UI/Language/LanguageSwitcher";

function RegisterPage() {
  useResetOnNavigation();
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("auth");
  const { register, isAuthenticated, alertMessage, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validatePassword = (password: string) => {
    // Règles de validation du mot de passe
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const errors = [];
    if (password.length < minLength) {
      errors.push(t("register.criteria.minLength", { count: minLength }));
    }
    if (!hasUpperCase) {
      errors.push(t("register.criteria.uppercase"));
    }
    if (!hasLowerCase) {
      errors.push(t("register.criteria.lowercase"));
    }
    if (!hasNumbers) {
      errors.push(t("register.criteria.number"));
    }
    if (!hasSpecialChar) {
      errors.push(t("register.criteria.specialChar"));
    }
    return errors.length > 0 ? errors.join(" ") : null;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");
    setSuccessMessage("");
    // Validation des mots de passe
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError(t("register.criteria.passwordMismatch"));
      return;
    }
    try {
      await register(firstName, lastName, email, password);
      setSuccessMessage(t(`register.accountCreated`));
      // Rediriger vers la page de validation de l'inscription
      setTimeout(
        () => navigate("/validate-registration", { state: { email } }),
        3000
      );
    } catch (err) {
      // L'erreur est gérée dans le contexte et mappée via authError
    }
  };
  return (
    // <div className="register-page">
    //   <form className="register-form" onSubmit={handleSubmit}>
    //     <h2>{t("register.title")}</h2>
    // {authError && (
    //   <div className="error-message">{t(`api_messages.${authError}`)}</div>
    // )}
    // {successMessage && (
    //   <div className="success-message">{successMessage}</div>
    // )}
    //     <div className="form-group">
    //       <label htmlFor="firstName">{t("register.firstName")}</label>
    //       <input
    // type="text"
    // id="firstName"
    // value={firstName}
    // onChange={(e) => setFirstName(e.target.value)}
    // placeholder={t("register.firstNamePlaceholder")}
    // required
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="lastName">{t("register.lastName")}</label>
    //       <input
    // type="text"
    // id="lastName"
    // value={lastName}
    // onChange={(e) => setLastName(e.target.value)}
    // placeholder={t("register.lastNamePlaceholder")}
    // required
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="email">{t("register.email")}</label>
    //       <input
    // type="email"
    // id="email"
    // value={email}
    // onChange={(e) => setEmail(e.target.value)}
    // placeholder={t("register.emailPlaceholder")}
    // required
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="password">{t("register.password")}</label>
    //       <input
    // type="password"
    // id="password"
    // value={password}
    // onChange={(e) => setPassword(e.target.value)}
    // placeholder={t("register.passwordPlaceholder")}
    // required
    //       />
    // {passwordError && <div className="error-text">{passwordError}</div>}
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="confirmPassword">
    //         {t("register.confirmPassword")}
    //       </label>
    //       <input
    // type="password"
    // id="confirmPassword"
    // value={confirmPassword}
    // onChange={(e) => setConfirmPassword(e.target.value)}
    // placeholder={t("register.confirmPasswordPlaceholder")}
    // required
    //       />
    //       {confirmError && <div className="error-text">{confirmError}</div>}
    //     </div>
    //     <button type="submit" className="submit-button" disabled={loading}>
    //       {/* {loading ? t("register.registering") : t("register.submit")} */}
    //       {loading ? <Loader /> : t("register.submit")}
    //     </button>
    //     {/* Ajout du lien vers le formulaire de login */}
    //     <div className="additional-links">
    //       <Link to="/login" className="login-link">
    //         {t("register.backToLogin")}
    //       </Link>
    //     </div>
    //   </form>
    // </div>

    <>
      <div className="iz_site">
        <div>
          <LanguageSwitcher />
        </div>
        <div className="iz_site-main iz_position-relative">
          <div className="iz_box-form-pass iz_box-form-signup iz_flex">
            <div className="iz-box-form-thumb same-height">
              <img alt="Sign up Zenicall" src="assets/img/signup.png" />
            </div>
            <div className="iz_box-form-content same-height">
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
                      {tCore(`errorMessages.${alertMessage.content}`)}
                    </div>
                  )}
                  {successMessage && (
                    <div className="success-message">{successMessage}</div>
                  )}
                  <h1>{t("register.title")}</h1>
                  {/* <p className="iz_form-desc">Sub text goes here </p> */}
                  <div className="iz_fields iz_flex">
                    <div className="iz_field iz_field-half">
                      <label>{t("register.firstName")}</label>
                      <input
                        // placeholder="john.doe@gmail.com"
                        className="iz_input-text"
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t("register.firstNamePlaceholder")}
                        required
                      />
                    </div>
                    <div className="iz_field iz_field-half">
                      <label>{t("register.lastName")}</label>
                      <input
                        // placeholder="john.doe@gmail.com"
                        className="iz_input-text"
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t("register.lastNamePlaceholder")}
                        required
                      />
                    </div>
                  </div>
                  <div className="iz_field">
                    <label>{t("register.email")}</label>
                    <input
                      // placeholder="john.doe@gmail.com"
                      className="iz_input-text"
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("register.emailPlaceholder")}
                      required
                    />
                  </div>
                  <div className="iz_field">
                    <label>{t("register.password")}</label>
                    <input
                      // placeholder=""
                      className="iz_input-password"
                      id="iz_field-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("register.passwordPlaceholder")}
                      required
                    />
                    <span
                      // toggle="#iz_field-password"
                      className="fa fa-fw fa-eye m_field-icon m_toggle-password"></span>

                    {passwordError && (
                      <div className="error-text">{passwordError}</div>
                    )}
                  </div>
                  <div className="iz_field">
                    <label>{t("register.confirmPassword")}</label>
                    <input
                      // placeholder=""
                      className="iz_input-password"
                      id="iz_field-password2"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("register.confirmPasswordPlaceholder")}
                      required
                    />
                    <span
                      // toggle="#iz_field-password2"
                      className="fa fa-fw fa-eye m_field-icon m_toggle-password"></span>

                    {confirmError && (
                      <div className="error-text">{confirmError}</div>
                    )}
                  </div>
                  <div className="iz_fields iz_flex">
                    <div className="iz_field iz_field-checkbox">
                      <input type="checkbox" id="iz_field-check-remember" />
                      <label htmlFor="iz_field-check-remember">
                        {t("register.agree")}{" "}
                        <Link to="/terms-and-privacy-policy">
                          {t("register.termsAndPolicies")}
                        </Link>
                      </label>
                    </div>
                    {/* <Link className="iz_link-forget-pass" to="/forgot-password">
                      Forgot Password
                    </Link> */}
                  </div>
                  <div className="iz_field">
                    <button
                      type="submit"
                      className="iz_btn-submit iz_btn-primary"
                      disabled={loading}>
                      {/* Create an account */}
                      {loading ? <Loader /> : t("register.submit")}
                    </button>
                  </div>
                  <p className="iz_text-signup iz_center">
                    {t("register.alreadyHaveAccount")}{" "}
                    <Link to="/login" title="Sign up" className="m_link-signup">
                      {t("login.title")}
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
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisterPage;
