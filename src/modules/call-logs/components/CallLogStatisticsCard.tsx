import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClinic } from '../../clinics/hooks/useClinic';
import AnalyticsService from '../../analytics/AnalyticsService';
import { LoadingScreen } from '../../../@zenidata/components/UI/Loader';
import './CallLogStatisticsCard.css';

interface CallLogStatistics {
  total_calls: number;
  average_daily_calls: number;
  calls_by_status: { [key: string]: number };
  busiest_day?: string;
  busiest_hour?: number;
}

const CallLogStatisticsCard: React.FC = () => {
  const { t } = useTranslation(['call-logs', 'core']);
  const { selectedClinic } = useClinic();
  const [statistics, setStatistics] = useState<CallLogStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClinic?.id) {
      setLoading(false);
      return;
    }

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AnalyticsService.getCallVolumeSummary(selectedClinic.id);
        setStatistics(data);
      } catch (err) {
        console.error("Failed to fetch call log statistics:", err);
        setError(t('core:errorMessages.GENERIC_ERROR'));
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedClinic?.id, t]);

  if (!selectedClinic) {
    return null; // Or a message indicating no clinic selected
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="statistics-error">{error}</div>;
  }

  if (!statistics) {
    return <div className="statistics-empty">{t('call-logs:statistics.noData')}</div>;
  }

  return (
    <div className="metric-card call-stats-card">
      <h3>{t('call-logs:statistics.title')}</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">{t('call-logs:statistics.totalCalls')}</span>
          <span className="stat-value">{statistics.total_calls}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('call-logs:statistics.avgDailyCalls')}</span>
          <span className="stat-value">{statistics.average_daily_calls.toFixed(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('call-logs:statistics.newCalls')}</span>
          <span className="stat-value">{statistics.calls_by_status.NEW || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('call-logs:statistics.inProgressCalls')}</span>
          <span className="stat-value">{statistics.calls_by_status['IN_PROGRESS'] || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('call-logs:statistics.doneCalls')}</span>
          <span className="stat-value">{statistics.calls_by_status.DONE || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('call-logs:statistics.archivedCalls')}</span>
          <span className="stat-value">{statistics.calls_by_status.ARCHIVED || 0}</span>
        </div>
        {statistics.busiest_day && (
          <div className="stat-item">
            <span className="stat-label">{t('call-logs:statistics.busiestDay')}</span>
            <span className="stat-value">{statistics.busiest_day}</span>
          </div>
        )}
        {statistics.busiest_hour !== undefined && (
          <div className="stat-item">
            <span className="stat-label">{t('call-logs:statistics.busiestHour')}</span>
            <span className="stat-value">{statistics.busiest_hour}:00</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallLogStatisticsCard;