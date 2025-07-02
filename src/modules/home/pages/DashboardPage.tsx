import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import Loader, { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import UserHello from "../../auth/components/UserHello";
import { formatDate } from "../../../@zenidata/utils";
import { useClinic } from "../../clinics/hooks/useClinic";
import { DashboardNewCallsWidget } from "../../call-logs/components/DashboardNewCallsWidget";
import DashboardCallLogStats from "../../call-logs/components/DashboardCallLogStats";

function DashboardPage() {
  const { t: tCore } = useTranslation("core");
  const { t } = useTranslation("home");
  const { selectedClinic, clinics } = useClinic();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalClinics, setTotalClinics] = useState<number>(0);
  const [loadingTotalClinics, setLoadingTotalClinics] = useState(true);

  // Use actual clinics from context
  const fetchTotalClinics = useCallback(async () => {
    setError("");
    try {
      setLoadingTotalClinics(true);
      // Use actual clinics count from context
      setTimeout(() => {
        setTotalClinics(clinics.length);
        setLoadingTotalClinics(false);
      }, 500);
    } catch (err) {
      handleAxiosError(err);
      setLoadingTotalClinics(false);
    }
  }, [clinics.length]);


  useEffect(() => {
    fetchTotalClinics();
    setLoading(false);
  }, [fetchTotalClinics]);

  return (
    <>
      <div className="iz_content-block iz_content-dasboard iz_position-relative">
        <div className="iz_content-block-container">
          <UserHello />

          <div className="iz_content-numbers iz_flex ">
            <div className="iz_content-numbers-total">
              <div className="iz_text iz_flex iz_position-relative">
                <span>{t("dashboard.totalClinics")} </span>
                <span className="iz_folder-number">
                  {loadingTotalClinics ? (
                    <Loader showText={false} />
                  ) : (
                    totalClinics
                  )}
                </span>
              </div>
            </div>
            <div className="iz_content-numbers-details iz_flex">
              <div className="iz_content-label-details">
                <span>{t("dashboard.callLogsProcessed")}</span>
              </div>

              <DashboardCallLogStats />
            </div>
          </div>

          {/* New Call Logs Dashboard Section */}
          <div className="iz_new-call-logs-section" style={{ margin: "2rem 0" }}>
            <DashboardNewCallsWidget />
          </div>

        </div>
      </div>
    </>
  );
}
export default DashboardPage;