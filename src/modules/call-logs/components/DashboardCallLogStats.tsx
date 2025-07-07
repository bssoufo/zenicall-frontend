import React from 'react';
import { useTranslation } from 'react-i18next';
import { CallVolumeSummary } from '../../analytics/AnalyticsService';

interface StatsDisplayProps {
  totalCalls: number;
  newCalls: number;
  inProgressCalls: number;
  doneCalls: number;
  archivedCalls: number;
}

interface DashboardCallLogStatsProps {
  summaryData?: CallVolumeSummary | null;
  loading?: boolean;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ 
  totalCalls, 
  newCalls, 
  inProgressCalls, 
  doneCalls,
  archivedCalls 
}) => {
  const { t } = useTranslation(['call-logs']);

  return (
    <ul className="stats-list">
      <li className="stats-item">
        <span className="stats-label">
          <span className="stats-dot stats-dot-total"></span>
          {t('call-logs:summary.totalCalls')}
        </span>
        <span className="stats-value">{totalCalls.toLocaleString()}</span>
      </li>
      <li className="stats-item">
        <span className="stats-label">
          <span className="stats-dot stats-dot-new"></span>
          {t('call-logs:summary.new')}
        </span>
        <span className="stats-value">{newCalls.toLocaleString()}</span>
      </li>
      <li className="stats-item">
        <span className="stats-label">
          <span className="stats-dot stats-dot-inprogress"></span>
          {t('call-logs:summary.inProgress')}
        </span>
        <span className="stats-value">{inProgressCalls.toLocaleString()}</span>
      </li>
      <li className="stats-item">
        <span className="stats-label">
          <span className="stats-dot stats-dot-done"></span>
          {t('call-logs:summary.done')}
        </span>
        <span className="stats-value">{doneCalls.toLocaleString()}</span>
      </li>
      <li className="stats-item">
        <span className="stats-label">
          <span className="stats-dot stats-dot-archived"></span>
          {t('call-logs:summary.archived')}
        </span>
        <span className="stats-value">{archivedCalls.toLocaleString()}</span>
      </li>
    </ul>
  );
};

const DashboardCallLogStats: React.FC<DashboardCallLogStatsProps> = ({ 
  summaryData, 
  loading = false 
}) => {
  const { t } = useTranslation(['call-logs']);

  // Show loading state
  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loading-skeleton">
          <div className="skeleton-bar"></div>
          <div className="skeleton-bar"></div>
          <div className="skeleton-bar"></div>
          <div className="skeleton-bar"></div>
          <div className="skeleton-bar"></div>
        </div>
      </div>
    );
  }

  // Show data or fallback values
  const stats = summaryData || {
    total_calls: 0,
    calls_by_status: { 'New': 0, 'In Progress': 0, 'Done': 0, 'Archived': 0 }
  };

  return (
    <StatsDisplay
      totalCalls={stats.total_calls}
      newCalls={stats.calls_by_status['New'] || 0}
      inProgressCalls={stats.calls_by_status['In Progress'] || 0}
      doneCalls={stats.calls_by_status['Done'] || 0}
      archivedCalls={stats.calls_by_status['Archived'] || 0}
    />
  );
};

export default DashboardCallLogStats;