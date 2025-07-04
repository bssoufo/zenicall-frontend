import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClinic } from '../../clinics/hooks/useClinic';
import CallLogService from '../CallLogService';
import './CallLogSummary.css';

const CallLogSummary: React.FC = () => {
  const { t } = useTranslation(['call-logs']);
  const { selectedClinic } = useClinic();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedClinic) return;

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const summaryData = await CallLogService.getCallLogSummary(selectedClinic.id);
        setSummary(summaryData);
      } catch (error) {
        console.error('Failed to fetch call log summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedClinic]);

  if (loading) {
    return <div className="call-log-summary-skeleton"></div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="call-log-summary">
      <div className="summary-card">
        <h4>{t('call-logs:summary.totalCalls')}</h4>
        <p>{summary.total_calls}</p>
      </div>
      <div className="summary-card">
        <h4>{t('call-logs:summary.new')}</h4>
        <p>{summary.calls_by_status.NEW || 0}</p>
      </div>
      <div className="summary-card">
        <h4>{t('call-logs:summary.inProgress')}</h4>
        <p>{summary.calls_by_status['IN_PROGRESS'] || 0}</p>
      </div>
      <div className="summary-card">
        <h4>{t('call-logs:summary.done')}</h4>
        <p>{summary.calls_by_status.DONE || 0}</p>
      </div>
    </div>
  );
};

export default CallLogSummary;