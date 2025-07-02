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
  const { selectedClinic, clinics } = useClinic();

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
                <Link to="/clinics" className="btn btn-primary">
                  <i className="fas fa-plus" aria-hidden="true"></i>
                  {t("dashboard.browseClinicsCTA")}
                </Link>
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
        {/* KPI Overview Banner */}
        <section className="dashboard-kpi-section" aria-labelledby="kpi-title">
          <h2 id="kpi-title" className="kpi-section-title">Aperçu de l'Activité</h2>
          <DashboardCallLogStats />
        </section>

        {/* New Call Logs Section */}
        <section className="dashboard-calls" aria-labelledby="calls-title">
          <div className="section-header">
            <h2 id="calls-title" className="section-title">{t("dashboard.recentCallLogs")}</h2>
            <p className="section-description">{t("dashboard.callsDescription")}</p>
          </div>
          <div className="calls-widget">
            <DashboardNewCallsWidget />
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="dashboard-actions" aria-labelledby="actions-title">
          <h2 id="actions-title" className="section-title">{t("dashboard.quickActions")}</h2>
          <div className="actions-grid">
            <Link to={`/clinics/${selectedClinic.id}/call-logs`} className="action-card">
              <div className="action-icon">
                <i className="fas fa-list" aria-hidden="true"></i>
              </div>
              <div className="action-content">
                <h3 className="action-title">{t("dashboard.allCallLogs")}</h3>
                <p className="action-description">{t("dashboard.allCallLogsDesc")}</p>
              </div>
              <div className="action-arrow">
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
              </div>
            </Link>
            
            <Link to="/clinics" className="action-card">
              <div className="action-icon">
                <i className="fas fa-clinic-medical" aria-hidden="true"></i>
              </div>
              <div className="action-content">
                <h3 className="action-title">{t("dashboard.manageClinics")}</h3>
                <p className="action-description">{t("dashboard.manageClinicsDesc")}</p>
              </div>
              <div className="action-arrow">
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
              </div>
            </Link>
            
            <Link to="/analytics" className="action-card">
              <div className="action-icon">
                <i className="fas fa-chart-bar" aria-hidden="true"></i>
              </div>
              <div className="action-content">
                <h3 className="action-title">{t("dashboard.analytics")}</h3>
                <p className="action-description">{t("dashboard.analyticsDesc")}</p>
              </div>
              <div className="action-arrow">
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
export default DashboardPage;