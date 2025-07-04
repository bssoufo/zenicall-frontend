import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AnalyticsService, { CallVolumeSummary } from "../AnalyticsService";
import { KPICardSkeleton } from "./SkeletonLoaders";
import "./KPICards.css";

interface KPICardsProps {
  clinicId: string;
  period?: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
  color?: "blue" | "green" | "orange" | "purple";
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon,
  color = "blue" 
}) => (
  <div className={`kpi-card kpi-card--${color}`}>
    <div className="kpi-card__header">
      <h3 className="kpi-card__title">{title}</h3>
      {icon && <i className={`kpi-card__icon ${icon}`}></i>}
    </div>
    
    <div className="kpi-card__value">{value}</div>
    
    <div className="kpi-card__footer">
      {trend && (
        <span className={`kpi-card__trend ${trend.isPositive ? 'positive' : 'negative'}`}>
          <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'}`}></i>
          {Math.abs(trend.value)}%
        </span>
      )}
      {subtitle && <span className="kpi-card__subtitle">{subtitle}</span>}
    </div>
  </div>
);

export const KPICards: React.FC<KPICardsProps> = ({ clinicId, period = "last_7_days" }) => {
  const { t } = useTranslation(["analytics"]);
  const [data, setData] = useState<CallVolumeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const summary = await AnalyticsService.getCallVolumeSummary(clinicId, period);
        setData(summary);
        setError(null);
      } catch (err) {
        setError(t("analytics:kpi.failedToLoad"));
        console.error("Error fetching KPI data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchData();
    }
  }, [clinicId, period]);

  if (loading) {
    return (
      <div className="kpi-cards-container">
        {Array.from({ length: 4 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="kpi-cards-error">
        <p>{t("analytics:kpi.errorLoading")}</p>
      </div>
    );
  }

  // Calculate additional metrics
  const totalCalls = data.total_calls;
  const avgDailyCalls = Math.round(data.average_daily_calls * 10) / 10;
  const growthRate = data.growth_rate_percentage;
  
  // Get status breakdown
  const newCalls = data.calls_by_status["NEW"] || 0;
  const inProgressCalls = data.calls_by_status["IN_PROGRESS"] || 0;
  const completedCalls = data.calls_by_status["DONE"] || 0;
  
  // Calculate completion rate
  const completionRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
  
  // Get busiest hour for additional insight
  const busiestHour = data.busiest_hour;
  const busiestHourText = busiestHour !== null 
    ? t("analytics:kpi.peakAt", { hour: busiestHour })
    : t("analytics:kpi.noPeakIdentified");
    
  // Helper function to format period text
  const formatPeriod = (period: string) => {
    return period.replace('last_', '').replace('_', ' ');
  };

  return (
    <div className="kpi-cards-container">
      <KPICard
        title={t("analytics:kpi.totalCalls")}
        value={totalCalls.toLocaleString()}
        subtitle={t("analytics:kpi.lastPeriod", { period: formatPeriod(period) })}
        trend={growthRate !== null ? {
          value: Math.round(Math.abs(growthRate) * 10) / 10,
          isPositive: growthRate >= 0
        } : undefined}
        icon="fas fa-phone"
        color="blue"
      />
      
      <KPICard
        title={t("analytics:kpi.dailyAverage")}
        value={avgDailyCalls}
        subtitle={busiestHourText}
        icon="fas fa-chart-line"
        color="green"
      />
      
      <KPICard
        title={t("analytics:kpi.newCalls")}
        value={newCalls.toLocaleString()}
        subtitle={t("analytics:kpi.inProgress", { count: inProgressCalls })}
        icon="fas fa-plus-circle"
        color="orange"
      />
      
      <KPICard
        title={t("analytics:kpi.completionRate")}
        value={`${completionRate}%`}
        subtitle={t("analytics:kpi.completed", { count: completedCalls })}
        trend={{
          value: completionRate,
          isPositive: completionRate >= 80
        }}
        icon="fas fa-check-circle"
        color="purple"
      />
    </div>
  );
};