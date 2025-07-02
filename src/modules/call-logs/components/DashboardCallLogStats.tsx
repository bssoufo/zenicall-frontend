import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useClinic } from '../../clinics/hooks/useClinic';
import CallLogService from '../CallLogService';
import Loader from '../../../@zenidata/components/UI/Loader';

interface CallLogSummaryData {
  total_calls: number;
  calls_by_status: {
    'New': number;
    'In Progress': number;
    'Done': number;
  };
}

interface StatsDisplayProps {
  totalCalls: number;
  newCalls: number;
  inProgressCalls: number;
  doneCalls: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ 
  totalCalls, 
  newCalls, 
  inProgressCalls, 
  doneCalls 
}) => {
  const { t } = useTranslation(['call-logs']);

  return (
    <div className="kpi-cards-container">
      <div className="kpi-card kpi-total">
        <div className="kpi-value">{totalCalls.toLocaleString()}</div>
        <div className="kpi-label">{t('call-logs:summary.totalCalls')}</div>
      </div>
      <div className="kpi-card kpi-new">
        <div className="kpi-value">{newCalls.toLocaleString()}</div>
        <div className="kpi-label">{t('call-logs:summary.new')}</div>
      </div>
      <div className="kpi-card kpi-inprogress">
        <div className="kpi-value">{inProgressCalls.toLocaleString()}</div>
        <div className="kpi-label">{t('call-logs:summary.inProgress')}</div>
      </div>
      <div className="kpi-card kpi-done">
        <div className="kpi-value">{doneCalls.toLocaleString()}</div>
        <div className="kpi-label">{t('call-logs:summary.done')}</div>
      </div>
    </div>
  );
};

const DashboardCallLogStats: React.FC = () => {
  const { selectedClinic } = useClinic();
  const [summary, setSummary] = useState<CallLogSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!selectedClinic?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const summaryData = await CallLogService.getCallLogSummary(selectedClinic.id);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch call log summary:', err);
      setError('Failed to load call statistics');
      // Fallback to empty data structure for graceful degradation
      setSummary({
        total_calls: 0,
        calls_by_status: {
          'New': 0,
          'In Progress': 0,
          'Done': 0
        }
      });
    } finally {
      setLoading(false);
    }
  }, [selectedClinic?.id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Show loading state
  if (loading) {
    return <Loader showText={false} />;
  }

  // Show error state with fallback to zero values for graceful degradation
  if (error && !summary) {
    return (
      <StatsDisplay
        totalCalls={0}
        newCalls={0}
        inProgressCalls={0}
        doneCalls={0}
      />
    );
  }

  // Show data or fallback values
  const stats = summary || {
    total_calls: 0,
    calls_by_status: { 'New': 0, 'In Progress': 0, 'Done': 0 }
  };

  return (
    <StatsDisplay
      totalCalls={stats.total_calls}
      newCalls={stats.calls_by_status['New'] || 0}
      inProgressCalls={stats.calls_by_status['In Progress'] || 0}
      doneCalls={stats.calls_by_status['Done'] || 0}
    />
  );
};

export default DashboardCallLogStats;