import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import Loader, { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import UserHello from "../../auth/components/UserHello";
import { formatDate } from "../../../@zenidata/utils";
import { AnalyticsDashboard } from "../../analytics/components/AnalyticsDashboard";
import { useClinic } from "../../clinics/hooks/useClinic";
import { DashboardNewCallsWidget } from "../../call-logs/components/DashboardNewCallsWidget";

function DashboardPage() {
  const { t: tCore } = useTranslation("core");
  const { t } = useTranslation("home");
  const { selectedClinic, clinics } = useClinic();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalClinics, setTotalClinics] = useState<number>(0);
  const [loadingTotalClinics, setLoadingTotalClinics] = useState(true);
  const [callLogsCounter, setCallLogsCounter] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  });
  const [loadingCallLogsCounter, setLoadingCallLogsCounter] = useState(true);

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

  const fetchCallLogsCount = useCallback(async () => {
    setError("");
    try {
      setLoadingCallLogsCounter(true);
      // TODO: Replace with actual CallLogService.getCallLogsCount()
      setTimeout(() => {
        setCallLogsCounter({
          today: 12,
          thisWeek: 45,
          thisMonth: 180,
          thisYear: 2100,
        });
        setLoadingCallLogsCounter(false);
      }, 1000);
    } catch (err) {
      handleAxiosError(err);
      setLoadingCallLogsCounter(false);
    }
  }, []);

  useEffect(() => {
    fetchTotalClinics();
    fetchCallLogsCount();
    setLoading(false);
  }, [fetchTotalClinics, fetchCallLogsCount]);

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

              {loadingCallLogsCounter ? (
                <Loader showText={false} />
              ) : (
                <div className="iz_content-values-details iz_flex">
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.today")}
                    </span>
                    <span className="iz_period-value">
                      {callLogsCounter.today}
                    </span>
                  </div>
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.week")}
                    </span>
                    <span className="iz_period-value">
                      {callLogsCounter.thisWeek}
                    </span>
                  </div>
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.month")}
                    </span>
                    <span className="iz_period-value">
                      {callLogsCounter.thisMonth}
                    </span>
                  </div>
                  <div className="iz_content-value">
                    <span className="iz_period-name">
                      {t("dashboard.year")}
                    </span>
                    <span className="iz_period-value">
                      {callLogsCounter.thisYear}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Call Logs Dashboard Section */}
          <div className="iz_new-call-logs-section" style={{ margin: "2rem 0" }}>
            <DashboardNewCallsWidget />
          </div>

          {/* Analytics Dashboard Section */}
          {selectedClinic ? (
            <div className="iz_analytics-dashboard-section" style={{ margin: "2rem 0" }}>
              <AnalyticsDashboard clinicId={selectedClinic.id} />
            </div>
          ) : clinics.length > 0 ? (
            <div className="iz_no-clinic-selected" style={{ 
              margin: "2rem 0", 
              padding: "2rem", 
              textAlign: "center", 
              background: "#f8fafc", 
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ color: "#6b7280", fontSize: "16px" }}>
                <i className="fas fa-chart-bar" style={{ fontSize: "48px", marginBottom: "16px", color: "#3b82f6" }}></i>
                <h3 style={{ margin: "0 0 8px 0", color: "#374151" }}>Analytics Dashboard</h3>
                <p style={{ margin: "0" }}>Select a clinic from the header to view detailed analytics and insights.</p>
              </div>
            </div>
          ) : null}

          <div className="iz_used-folders-block">
            <div className="iz_content-title iz_flex">
              <h2 className="iz_title-h2">{t("dashboard.clinicsOverview")}</h2>
              <div className="iz_flex iz_content-links">
                <Link
                  to="/clinics/"
                  title="View All Clinics"
                  className="iz_link-blue">
                  {t("dashboard.viewAll")}
                </Link>
                <Link
                  to="/clinics/create"
                  className="iz_btn iz_btn-primary iz_hidden-mobile">
                  {t("dashboard.addClinic")}
                </Link>
              </div>
            </div>
            {loading ? (
              <LoadingScreen />
            ) : (
              <div className="iz_used-folders-boxes iz_flex">
                <div className="iz_folder-box iz_flex iz_position-relative">
                  <div className="iz_folder-box-content">
                    <div className="iz_folder-box-icon">
                      <i className="iz_icon-folder-box"></i>
                    </div>
                    <div className="iz_folder-box-details iz_flex">
                      <span className="iz_folder-name">Dental Clinic A</span>
                      <span className="iz_folder-qty">
                        25 {t("dashboard.callLogs")}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/clinics/1`}
                    className="iz_link-overlay"></Link>
                </div>
              </div>
            )}
            <div className="iz_content-title iz_flex  iz_hidden-tablet-desktop">
              <div className="iz_flex iz_content-links">
                <Link to="/clinics/create" className="iz_btn iz_btn-primary iz_btn-add-folder">
                  {t("dashboard.addClinic")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default DashboardPage;