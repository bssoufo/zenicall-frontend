import { useTranslation } from "react-i18next";

const ContactSuccess = ({ onBackToHome, backToForm }) => {
  const { t } = useTranslation("home");

  return (
    <>
      <div className="iz_back-link">
        <a onClick={backToForm}>{t("contact.backToContactForm")}</a>
      </div>

      <div
        style={{ textAlign: "center", padding: "50px", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {t("contact.messageSendTitle")}
        </h1>
        <p style={{ margin: "20px 0" }}>
          {t("contact.messageSendDescription")}
        </p>
        <button className="iz_btn iz_btn-primary" onClick={onBackToHome}>
          {t("contact.backToDashboard")}
        </button>
      </div>
    </>
  );
};

export default ContactSuccess;
