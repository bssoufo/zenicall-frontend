import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Clinic from "../ClinicModel";
import ClinicService from "../ClinicService";
import UserHello from "../../auth/components/UserHello";
import { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import { formatDate } from "../../../@zenidata/utils";

const ClinicDetailsPage: React.FC = () => {
  const { t } = useTranslation("clinics");
  const { clinicId } = useParams<{ clinicId: string }>();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClinic = async () => {
      if (!clinicId) return;
      setLoading(true);
      try {
        const data = await ClinicService.getClinicById(+clinicId);
        setClinic(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClinic();
  }, [clinicId]);

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <UserHello />

        <div className="iz_back-link">
          <Link to="/clinics">{t("clinicDetails.backToClinics")}</Link>
        </div>

        <div className="iz_folder-creation-block">
          <div className="iz_content-title iz_flex">
            <h2 className="iz_title-h2">{t("clinicDetails.clinicDetails")}</h2>
          </div>

          {loading ? (
            <LoadingScreen />
          ) : clinic ? (
            <div className="iz_fields iz_flex">
              <div className="iz_field iz_field-half">
                <label>{t("clinicDetails.id")}</label>
                <span>{clinic.id}</span>
              </div>
              <div className="iz_field iz_field-half">
                <label>{t("clinicDetails.name")}</label>
                <span>{clinic.name}</span>
              </div>
              <div className="iz_field iz_field-half">
                <label>{t("clinicDetails.createdAt")}</label>
                <span>{formatDate(clinic.created_at)}</span>
              </div>
              <div className="iz_field iz_field-half">
                <label>{t("clinicDetails.updatedAt")}</label>
                <span>{formatDate(clinic.updated_at)}</span>
              </div>
            </div>
          ) : (
            <p>{t("api_messages.CLINIC_NOT_FOUND")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailsPage;