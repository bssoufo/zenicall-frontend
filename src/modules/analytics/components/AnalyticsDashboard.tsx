import React, { Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useClinic } from "../../clinics/hooks/useClinic";
import { KPICards } from "./KPICards";
import { CallVolumeChart } from "./CallVolumeChart";
import { CallStatusChart } from "./CallStatusChart";
import { DashboardSkeleton, ChartSkeleton, PieChartSkeleton } from "./SkeletonLoaders";
import "./AnalyticsDashboard.css";

// Lazy load complex components
const CallReasonChart = React.lazy(() => import("./CallReasonChart"));
const HourlyPatternsChart = React.lazy(() => import("./HourlyPatternsChart"));
const ComparisonChart = React.lazy(() => import("./ComparisonChart"));

interface AnalyticsDashboardProps {
  clinicId?: string;
}

type TimePeriod = "last_24_hours" | "last_7_days" | "last_30_days" | "last_90_days";
type ChartType = "area" | "bar";

const getPeriodOptions = (t: any) => [
  { value: "last_24_hours", label: t("analytics:controls.last24Hours"), granularity: "hour" },
  { value: "last_7_days", label: t("analytics:controls.last7Days"), granularity: "day" },
  { value: "last_30_days", label: t("analytics:controls.last30Days"), granularity: "day" },
  { value: "last_90_days", label: t("analytics:controls.last90Days"), granularity: "week" }
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ clinicId: propClinicId }) => {
  const { t } = useTranslation(["analytics"]);
  const { selectedClinic } = useClinic();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("last_7_days");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Use prop clinic ID or selected clinic from context
  const clinicId = propClinicId || selectedClinic?.id;

  // Loading strategy: Show advanced charts after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdvanced(true);
    }, 1000); // Load advanced charts 1 second after initial render

    return () => clearTimeout(timer);
  }, []);

  if (!clinicId) {
    return (
      <div className="analytics-dashboard">
        <div className="dashboard-error">
          <div className="error-content">
            <i className="fas fa-clinic-medical"></i>
            <h3>{t("analytics:dashboard.noClinicSelected")}</h3>
            <p>{t("analytics:dashboard.noClinicMessage")}</p>
          </div>
        </div>
      </div>
    );
  }

  const PERIOD_OPTIONS = getPeriodOptions(t);
  const currentPeriodConfig = PERIOD_OPTIONS.find(p => p.value === selectedPeriod);

  return (
    <div className="analytics-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">{t("analytics:dashboard.title")}</h1>
          <p className="dashboard-subtitle">
            {t("analytics:dashboard.subtitle", { clinicName: selectedClinic?.name || "Selected Clinic" })}
          </p>
        </div>

        <div className="dashboard-controls">
          <div className="control-group">
            <label htmlFor="period-select">{t("analytics:controls.timePeriod")}</label>
            <select
              id="period-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
              className="control-select"
            >
              {PERIOD_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="chart-type-select">{t("analytics:controls.chartType")}</label>
            <select
              id="chart-type-select"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="control-select"
            >
              <option value="area">{t("analytics:controls.areaChart")}</option>
              <option value="bar">{t("analytics:controls.barChart")}</option>
            </select>
          </div>

          <button
            className="refresh-btn"
            onClick={() => window.location.reload()}
            title={t("analytics:dashboard.refreshData")}
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {/* Above-the-fold: Critical metrics loaded first */}
      <div className="dashboard-section">
        <KPICards clinicId={clinicId} period={selectedPeriod} />
      </div>

      {/* Primary Charts Section */}
      <div className="dashboard-section primary-charts">
        <div className="chart-grid-primary">
          <div className="chart-main">
            <CallVolumeChart
              clinicId={clinicId}
              period={selectedPeriod}
              granularity={currentPeriodConfig?.granularity || "day"}
              chartType={chartType}
              height={400}
            />
          </div>
          <div className="chart-secondary">
            <CallStatusChart
              clinicId={clinicId}
              period={selectedPeriod}
              chartType="donut"
              size={350}
            />
          </div>
        </div>
      </div>

      {/* Secondary Charts Section - Lazy Loaded */}
      {showAdvanced && (
        <div className="dashboard-section secondary-charts">
          <div className="chart-grid-secondary">
            <div className="chart-item">
              <Suspense fallback={<ChartSkeleton height={300} />}>
                <CallReasonChart clinicId={clinicId} period={selectedPeriod} />
              </Suspense>
            </div>
            <div className="chart-item">
              <Suspense fallback={<ChartSkeleton height={300} />}>
                <HourlyPatternsChart clinicId={clinicId} period={selectedPeriod} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analytics Section - Lazy Loaded */}
      {showAdvanced && (
        <div className="dashboard-section advanced-charts">
          <div className="chart-grid-advanced">
            <div className="chart-item-full">
              <Suspense fallback={<ChartSkeleton height={350} />}>
                <ComparisonChart
                  clinicId={clinicId}
                  currentPeriod={selectedPeriod}
                  granularity={currentPeriodConfig?.granularity || "day"}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator for Advanced Charts */}
      {!showAdvanced && (
        <div className="loading-advanced">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>{t("analytics:dashboard.loadingAdvanced")}</p>
          </div>
        </div>
      )}
    </div>
  );
};