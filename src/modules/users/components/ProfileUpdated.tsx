import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProfileUpdated = ({ onBackToProfile, backToForm }) => {
  const { t } = useTranslation("users");

  return (
    <>
      <div className="iz_back-link">
        <a onClick={backToForm}>{t("account.backToProfileUpdate")}</a>
      </div>

      <div
        style={{ textAlign: "center", padding: "50px", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {t("account.profileUpdatedTitle")}
        </h1>
        <p style={{ margin: "20px 0" }}>
          {t("account.profileUpdatedDescription")}
        </p>
        <button className="iz_btn iz_btn-primary" onClick={onBackToProfile}>
          {t("account.backToDashboard")}
        </button>
      </div>
    </>
  );
};

export default ProfileUpdated;
