// src\modules\users\pages\MyAccountPage.tsx
import { useContext, useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loader from "../../../@zenidata/components/UI/Loader";
import { AuthContext } from "../../auth/contexts/AuthContext";
import "./MyAccountPage.css";
import ProfileUpdated from "../components/ProfileUpdated";
import { updateProfileService } from "../../auth/authService";

const MyAccountPage = () => {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("users");

  const navigate = useNavigate();

  const { alertMessage, user } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
    }
  }, [user]);

  const validatePassword = (password: string) => {
    if (!password) return null; // Skip validation if empty

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const errors = [];

    if (password.length < minLength) {
      errors.push(
        t("account.passwordCriteria.minLength", { count: minLength })
      );
    }
    if (!hasUpperCase) {
      errors.push(t("account.passwordCriteria.uppercase"));
    }
    if (!hasLowerCase) {
      errors.push(t("account.passwordCriteria.lowercase"));
    }
    if (!hasNumbers) {
      errors.push(t("account.passwordCriteria.number"));
    }
    if (!hasSpecialChar) {
      errors.push(t("account.passwordCriteria.specialChar"));
    }

    return errors.length > 0 ? errors.join(" ") : null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");
    setErrorMessage("");

    // Only validate if password is not empty
    if (password) {
      const validationError = validatePassword(password);
      if (validationError) {
        setPasswordError(validationError);
        return;
      }

      if (password !== passwordConfirmation) {
        setConfirmError(t("account.passwordCriteria.passwordMismatch"));
        return;
      }
    }

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        ...(password && { password }),
        ...(password && { passwordConfirmation }),
      };

      setLoading(true);
      const response = await updateProfileService(payload);
      console.log(response);

      const storedUser = localStorage.getItem("user");

      if (storedUser && response) {
        const { first_name, last_name } = response;
        const updatedUser = JSON.stringify({
          ...JSON.parse(storedUser),
          first_name,
          last_name,
        });
        localStorage.setItem("user", updatedUser);
      }

      setPassword("");
      setPasswordConfirmation("");
      setIsSubmitted(true);
      // setTimeout(() => setIsSubmitted(false), 5000);
      setLoading(false);
    } catch (error) {
      console.log(error);
      // Error handling managed by context
      setErrorMessage("errorMessages.GENERIC_ERROR");
      setLoading(false);
    }
  };

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <div className="iz_box-form-content">
          <div className="iz_form-box">
            {isSubmitted ? (
              <ProfileUpdated
                backToForm={() => setIsSubmitted(false)}
                onBackToProfile={() => navigate("/")}
              />
            ) : (
              <form
                style={{
                  paddingBottom: "4rem",
                  maxWidth: "500px",
                  margin: "auto",
                }}
                onSubmit={handleSubmit}>
                {isSubmitted && (
                  <div className="success-message">
                    {t("account.successMessage")}
                  </div>
                )}

                {alertMessage && (
                  <div className="error-message">{alertMessage.content}</div>
                )}

                <h1>{t("account.title")}</h1>

                <div className="iz_field">
                  <label>{t("account.firstName")}</label>
                  <input
                    className="iz_input-text"
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t("account.firstNamePlaceholder")}
                    required
                  />
                </div>

                <div className="iz_field">
                  <label>{t("account.lastName")}</label>
                  <input
                    className="iz_input-text"
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("account.lastNamePlaceholder")}
                    required
                  />
                </div>

                <div className="iz_field">
                  <label>{t("account.password")}</label>
                  <input
                    className="iz_input-text"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("account.password")}
                  />

                  {password && (
                    <div className="password-criteria">
                      <ul>
                        <li
                          className={`criteria-item ${
                            password.length >= 8 ? "valid" : "invalid"
                          }`}>
                          <span className="criteria-icon">
                            {password.length >= 8 ? "✓" : "✗"}
                          </span>
                          {t("account.passwordCriteria.minLength", {
                            count: 8,
                          })}
                        </li>
                        <li
                          className={`criteria-item ${
                            /[A-Z]/.test(password) ? "valid" : "invalid"
                          }`}>
                          <span className="criteria-icon">
                            {/[A-Z]/.test(password) ? "✓" : "✗"}
                          </span>
                          {t("account.passwordCriteria.uppercase")}
                        </li>
                        <li
                          className={`criteria-item ${
                            /[a-z]/.test(password) ? "valid" : "invalid"
                          }`}>
                          <span className="criteria-icon">
                            {/[a-z]/.test(password) ? "✓" : "✗"}
                          </span>
                          {t("account.passwordCriteria.lowercase")}
                        </li>
                        <li
                          className={`criteria-item ${
                            /\d/.test(password) ? "valid" : "invalid"
                          }`}>
                          <span className="criteria-icon">
                            {/\d/.test(password) ? "✓" : "✗"}
                          </span>
                          {t("account.passwordCriteria.number")}
                        </li>
                        <li
                          className={`criteria-item ${
                            /[!@#$%^&*(),.?":{}|<>]/.test(password)
                              ? "valid"
                              : "invalid"
                          }`}>
                          <span className="criteria-icon">
                            {/[!@#$%^&*(),.?":{}|<>]/.test(password)
                              ? "✓"
                              : "✗"}
                          </span>
                          {t("account.passwordCriteria.specialChar")}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="iz_field">
                  <label>{t("account.passwordConfirmation")}</label>
                  <input
                    className="iz_input-text"
                    type="password"
                    id="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder={t("account.passwordConfirmation")}
                  />

                  {passwordConfirmation && (
                    <div
                      className={`confirm-message ${
                        password === passwordConfirmation
                          ? "confirm-valid"
                          : "confirm-invalid"
                      }`}>
                      {password === passwordConfirmation
                        ? t("account.passwordCriteria.matchValid")
                        : t("account.passwordCriteria.matchInvalid")}
                    </div>
                  )}
                </div>

                <div className="iz_field">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    disabled={loading}
                    className="iz_btn-submit iz_btn-primary">
                    {loading ? <Loader /> : tCore("button.submit")}
                  </button>
                </div>

                {errorMessage && (
                  <div className="error-message">{tCore(errorMessage)}</div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
