import React from 'react';
import { useTranslation } from 'react-i18next';
import { CallLogListView, CallLogReasonForCall } from '../CallLogModel';
import './CallReasonProgressBar.css';

interface CallReasonProgressBarProps {
  callLogs: CallLogListView[];
}

const CallReasonProgressBar: React.FC<CallReasonProgressBarProps> = ({ callLogs }) => {
  const { t } = useTranslation('call-logs');

  const reasonCounts = callLogs.reduce((acc, log) => {
    const reason = log.reason_for_call || 'Other'; // Default to 'Other' if reason is null/undefined
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<CallLogReasonForCall | 'Other', number>);

  const totalCalls = callLogs.length;

  if (totalCalls === 0) {
    return (
      <div className="call-reason-progress-bar">
        <p>{t('dashboard.noCallData')}</p>
      </div>
    );
  }

  const sortedReasons = Object.entries(reasonCounts).sort(([, countA], [, countB]) => countB - countA);

  return (
    <div className="call-reason-progress-bar">
      {sortedReasons.map(([reason, count]) => {
        const percentage = (count / totalCalls) * 100;
        return (
          <div key={reason} className="progress-item">
            <div className="progress-label">
              <span>{t(`callReasons.${reason.replace(/ /g, '')}`)}</span>
              <span>{percentage.toFixed(1)}% ({count})</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CallReasonProgressBar;
