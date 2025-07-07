import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import Loader from "../../../@zenidata/components/UI/Loader";
import { useClinic } from "../../clinics/hooks/useClinic";
import { DashboardNewCallsWidget } from "../../call-logs/components/DashboardNewCallsWidget";
import DashboardCallLogStats from "../../call-logs/components/DashboardCallLogStats";
import DashboardCallReasonDistribution from "../../call-logs/components/DashboardCallReasonDistribution";
import AnalyticsService, { CallVolumeSummary } from "../../analytics/AnalyticsService";
import './DashboardPage.css';

function DashboardPage() {
  const { t } = useTranslation("home");
  const { selectedClinic, clinics, loading: loadingClinics } = useClinic();

  const [loading, setLoading] = useState(true);
  const [totalClinics, setTotalClinics] = useState<number>(0);
  const [loadingTotalClinics, setLoadingTotalClinics] = useState(true);
  
  // Shared call volume summary data to avoid duplicate API calls
  const [callVolumeSummary, setCallVolumeSummary] = useState<CallVolumeSummary | null>(null);
  const [loadingCallVolume, setLoadingCallVolume] = useState(false);
  
  // Sidebar collapse/expand state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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

  // Fetch call volume summary data once for the entire dashboard
  const fetchCallVolumeSummary = useCallback(async () => {
    if (!selectedClinic?.id) {
      return;
    }

    try {
      setLoadingCallVolume(true);
      console.log('Dashboard: Fetching call volume summary for clinic:', selectedClinic.id);
      const summaryData = await AnalyticsService.getCallVolumeSummary(selectedClinic.id);
      console.log('Dashboard: Received call volume summary:', summaryData);
      setCallVolumeSummary(summaryData);
    } catch (err) {
      console.error('Dashboard: Failed to fetch call volume summary:', err);
      setCallVolumeSummary(null);
    } finally {
      setLoadingCallVolume(false);
    }
  }, [selectedClinic?.id]);

  useEffect(() => {
    fetchTotalClinics();
    setLoading(false);
  }, [fetchTotalClinics]);

  useEffect(() => {
    fetchCallVolumeSummary();
  }, [fetchCallVolumeSummary]);

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
        <div className={`dashboard-main-grid ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {/* Left Column - Call Logs Section (70%) */}
          <section className="dashboard-call-logs-section" aria-labelledby="call-logs-title">
            <div className="call-logs-section-header">
              <h2 id="call-logs-title" className="call-logs-section-title">{t("dashboard.callsToAction")}</h2>
              <button 
                className="sidebar-toggle-btn"
                onClick={toggleSidebar}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSidebar();
                  }
                }}
                aria-label={isSidebarCollapsed ? t("dashboard.expandSidebar") : t("dashboard.collapseSidebar")}
                aria-expanded={!isSidebarCollapsed}
                aria-controls="dashboard-control-panel"
                title={isSidebarCollapsed ? t("dashboard.expandSidebar") : t("dashboard.collapseSidebar")}
              >
                <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-left' : 'fa-chevron-right'}`} aria-hidden="true"></i>
              </button>
            </div>
            <DashboardNewCallsWidget />
          </section>

          {/* Right Column - Control Panel (30%) */}
          <aside 
            id="dashboard-control-panel"
            className={`dashboard-control-panel ${isSidebarCollapsed ? 'collapsed' : ''}`} 
            aria-labelledby="control-panel-title"
            aria-hidden={isSidebarCollapsed}
          >
            {/* KPI Stats in Control Panel */}
            <section className="control-panel-kpis" aria-labelledby="kpi-title">
              <h3 id="kpi-title" className="control-panel-section-title">{t("dashboard.overview")}</h3>
              <DashboardCallLogStats 
                summaryData={callVolumeSummary} 
                loading={loadingCallVolume} 
              />
            </section>

            {/* Call Reason Distribution */}
            <DashboardCallReasonDistribution 
              clinicId={selectedClinic?.id}
              summaryData={callVolumeSummary}
              loading={loadingCallVolume}
            />

            {/* Quick Actions in Control Panel - Temporarily Hidden */}
            {/*
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
            */}
          </aside>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;