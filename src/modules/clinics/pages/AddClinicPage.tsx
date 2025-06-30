import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ClinicService from "../ClinicService";
import { ClinicCreateDto } from "../ClinicModel";
import UserHello from "../../auth/components/UserHello";

const AddClinicPage: React.FC = () => {
  const { t } = useTranslation("clinics");
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ClinicService.addClinic(new ClinicCreateDto(name));
      navigate("/clinics");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="iz_content-block iz_content-folder iz_bg-white">
      <div className="iz_content-block-container">
        <UserHello />

        <div className="iz_back-link">
          <Link to="/clinics">{t("addClinic.backToClinics")}</Link>
        </div>

        <div className="iz_folder-creation-block">
          <div className="iz_content-title iz_flex">
            <h2 className="iz_title-h2">{t("addClinic.addNewClinic")}</h2>
          </div>

          <div className="iz_create-folder iz_container-form">
            <form onSubmit={handleSubmit}>
              <div className="iz_fields iz_flex">
                <div className="iz_field iz_field-half iz_field-has-limit-text">
                  <label>
                    {t("addClinic.nameLabel")} <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("addClinic.namePlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="iz_btns-actions iz_flex iz_position-relative">
                <button
                  type="button"
                  className="iz_btn iz_btn-white"
                  onClick={() => navigate("/clinics")}
                >
                  {t("button.cancel")}
                </button>
                <button
                  type="submit"
                  className="iz_btn iz_btn-primary"
                  disabled={loading}
                >
                  {t("button.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClinicPage;