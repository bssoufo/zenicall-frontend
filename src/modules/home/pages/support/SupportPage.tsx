// src\modules\home\pages\support\SupportPage.tsx
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../@zenidata/components/UI/Loader";
import { contactService } from "../../../auth/authService";
import ContactSuccess from "../../components/ContactSuccess";
import "./support.css";

const SupportPage = () => {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("home");
  // const { alertMessage,  } = useContext(AuthContext);

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [urgence, setUrgence] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (subject.length < 5) {
      setErrorMessage("Subject should have at least 5 characters");
      return;
    }

    if (subject.length < 5) {
      setErrorMessage("Subject should have at least 5 characters");
      return;
    }

    if (message.length < 10) {
      setErrorMessage("Message should have at least 10 characters");
      return;
    }

    if (!category) {
      setErrorMessage("Please select a category");
      return;
    }

    if (!urgence) {
      setErrorMessage("Please select a urgence level");
      return;
    }

    try {
      setLoading(true);
      await contactService(name, email, subject, category, urgence, message);
      // Reset form on success
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setCategory("");
      setUrgence("");
      setIsSubmitted(true);
      setErrorMessage("");
      // setTimeout(() => setIsSubmitted(false), 5000);
      setLoading(false);
    } catch (error) {
      // Error handling managed by AuthContext
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
              <ContactSuccess
                backToForm={() => setIsSubmitted(false)}
                onBackToHome={() => navigate("/")}
              />
            ) : (
              <form
                style={{
                  paddingBottom: "4rem",
                  maxWidth: "500px",
                  margin: "auto",
                }}
                onSubmit={handleSubmit}>
                {/* {alertMessage && (
                <div className="error-message">{alertMessage.content}</div>
              )} */}

                <h1>{t("contact.title")}</h1>

                <div className="iz_field">
                  <label>{t("contact.name")}</label>
                  <input
                    className="iz_input-text"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("contact.namePlaceholder")}
                    required
                  />
                </div>

                <div className="iz_field">
                  <label>{t("contact.email")}</label>
                  <input
                    className="iz_input-text"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("contact.emailPlaceholder")}
                    required
                  />
                </div>

                <div className="iz_field">
                  <label>{t("contact.subject")}</label>
                  <input
                    className="iz_input-text"
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("contact.subjectPlaceholder")}
                    required
                  />
                </div>

                <div className="iz_field">
                  <select
                    style={{ width: "100%" }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required>
                    <option value="">{t("contact.categoryPlaceholder")}</option>
                    <option value="technical">
                      {t("contact.categoryOptionTechnical")}
                    </option>
                    <option value="billing">
                      {t("contact.categoryOptionBilling")}
                    </option>
                    <option value="data_quality">
                      {t("contact.categoryOptionDataQuality")}
                    </option>
                    <option value="feature_request">
                      {t("contact.categoryOptionFeatureRequest")}
                    </option>
                    <option value="other">
                      {t("contact.categoryOptionOther")}
                    </option>
                  </select>
                </div>

                <div className="iz_field">
                  <select
                    style={{ width: "100%" }}
                    value={urgence}
                    onChange={(e) => setUrgence(e.target.value)}
                    required>
                    <option value="">{t("contact.urgencePlaceholder")}</option>
                    <option value="low">{t("contact.urgenceOptionLow")}</option>
                    <option value="normal">
                      {t("contact.urgenceOptionNormal")}
                    </option>
                    <option value="high">
                      {t("contact.urgenceOptionHigh")}
                    </option>
                  </select>
                </div>

                <div className="iz_field">
                  <label>{t("contact.message")}</label>
                  <textarea
                    rows={8}
                    style={{ resize: "none" }}
                    className="iz_input-password"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("contact.messagePlaceholder")}
                    required></textarea>
                </div>

                <div className="iz_field">
                  <button
                    style={{ width: "100%" }}
                    type="submit"
                    disabled={loading}
                    className="iz_btn-submit iz_btn-primary">
                    {loading ? <Loader /> : t("contact.send")}
                  </button>
                </div>

                {/* {isSubmitted && (
                  <div className="success-message">
                    {t("contact.successMessage")}
                  </div>
                )} */}

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

export default SupportPage;
