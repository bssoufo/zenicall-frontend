import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import Loader from "../../../@zenidata/components/UI/Loader";
import { useClinic } from "../../clinics/hooks/useClinic";
import { DashboardNewCallsWidget } from "../../call-logs/components/DashboardNewCallsWidget";
import DashboardCallLogStats from "../../call-logs/components/DashboardCallLogStats";
import './DashboardPage.css';

function DashboardPage() {
  const { t } = useTranslation("home");
  const { selectedClinic, clinics, loading: loadingClinics } = useClinic();

  const [loading, setLoading] = useState(true);
  const [totalClinics, setTotalClinics] = useState<number>(0);
  const [loadingTotalClinics, setLoadingTotalClinics] = useState(true);

  // Use actual clinics from context
  const fetchTotalClinics = useCallback(async () => {
    try {
      setLoadingTotalClinics(true);
      // Use actual clinics count from context
      setTimeout(() => {
        setTotalClinics(clinics.length);
        setLoadingTotalClinics(false);
      }, 300);
    } catch (err) {
      handleAxiosError(err);
      setLoadingTotalClinics(false);
    }
  }, [clinics.length]);


  useEffect(() => {
    fetchTotalClinics();
    setLoading(false);
  }, [fetchTotalClinics]);

  // No clinic selected state
  if (!selectedClinic) {
    return (
      <div className="iz_content-block iz_content-dasboard iz_position-relative">
        <div className="iz_content-block-container">
          <div className="no-clinic-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <i className="fas fa-clinic-medical" aria-hidden="true"></i>
              </div>
              <h2 className="empty-state-title">{t("dashboard.noClinicSelected")}</h2>
              <p className="empty-state-description">{t("dashboard.selectClinicMessage")}</p>
              <div className="empty-state-actions">
                {!loadingClinics && (
                  <Link to="/clinics" className="btn btn-primary">
                    <i className="fas fa-plus" aria-hidden="true"></i>
                    {t("dashboard.browseClinicsCTA")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        {/* New Two-Column Layout - No KPI Banner */}
        <div className="dashboard-main-grid">
          {/* Left Column - Call Logs Section (70%) */}
          <section className="dashboard-call-logs-section" aria-labelledby="call-logs-title">
            <h2 id="call-logs-title" className="call-logs-section-title">{t("dashboard.callsToAction")}</h2>
            <DashboardNewCallsWidget />
          </section>

          {/* Right Column - Control Panel (30%) */}
          <aside className="dashboard-control-panel" aria-labelledby="control-panel-title">
            {/* KPI Stats in Control Panel */}
            <section className="control-panel-kpis" aria-labelledby="kpi-title">
              <h3 id="kpi-title" className="control-panel-section-title">{t("dashboard.overview")}</h3>
              <DashboardCallLogStats />
            </section>

            {/* Quick Actions in Control Panel */}
            <section className="control-panel-actions" aria-labelledby="actions-title">
              <h3 id="actions-title" className="control-panel-section-title">{t("dashboard.quickActions")}</h3>
              <div className="control-panel-action-list">
                <Link to={`/clinics/${selectedClinic.id}/call-logs`} className="control-panel-action-card">
                  <div className="control-panel-action-icon">
                    <i className="fas fa-list" aria-hidden="true"></i>
                  </div>
                  <div className="control-panel-action-content">
                    <h4 className="control-panel-action-title">{t("dashboard.allCallLogs")}</h4>
                    <p className="control-panel-action-description">{t("dashboard.allCallLogsDesc")}</p>
                  </div>
                  <div className="control-panel-action-arrow">
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                  </div>
                </Link>
                
                <Link to="/analytics" className="control-panel-action-card">
                  <div className="control-panel-action-icon">
                    <i className="fas fa-chart-bar" aria-hidden="true"></i>
                  </div>
                  <div className="control-panel-action-content">
                    <h4 className="control-panel-action-title">{t("dashboard.analytics")}</h4>
                    <p className="control-panel-action-description">{t("dashboard.analyticsDesc")}</p>
                  </div>
                  <div className="control-panel-action-arrow">
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                  </div>
                </Link>

                <Link to="/support" className="control-panel-action-card">
                  <div className="control-panel-action-icon">
                    <i className="fas fa-life-ring" aria-hidden="true"></i>
                  </div>
                  <div className="control-panel-action-content">
                    <h4 className="control-panel-action-title">{t("dashboard.support")}</h4>
                    <p className="control-panel-action-description">{t("dashboard.supportDesc")}</p>
                  </div>
                  <div className="control-panel-action-arrow">
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                  </div>
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;