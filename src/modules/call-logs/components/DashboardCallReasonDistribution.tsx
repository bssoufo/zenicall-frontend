import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './DashboardCallReasonDistribution.css';
import CallLogService from '../CallLogService';
import { useCallLogEnums } from '../../../@zenidata/hooks/useEnumTranslation';

interface CallVolumeByReason {
  reason: string;
  count: number;
  percentage: number;
}

interface CallVolumeSummary {
  clinic_id: string;
  total_calls: number;
  calls_by_reason: CallVolumeByReason[];
}

interface DashboardCallReasonDistributionProps {
  clinicId?: string;
}

const DashboardCallReasonDistribution: React.FC<DashboardCallReasonDistributionProps> = ({ 
  clinicId = "default-clinic-id" 
}) => {
  const { t } = useTranslation(['home', 'call-logs']);
  const { reason: translateReason } = useCallLogEnums();
  const [reasonData, setReasonData] = useState<CallVolumeByReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReasonDistribution = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Utilise l'endpoint CallLogService existant pour récupérer le summary
        const summary: CallVolumeSummary = await CallLogService.getCallLogSummary(clinicId);
        
        // Trie par pourcentage décroissant et limite aux 5 premiers motifs
        const sortedReasons = summary.calls_by_reason
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);
        
        setReasonData(sortedReasons);
      } catch (err) {
        console.error('Failed to fetch call reason distribution:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchReasonDistribution();
  }, [clinicId]);

  // Using the new enum translation hook - much cleaner!
  const getReasonLabel = (reason: string): string => {
    return translateReason(reason);
  };

  const getReasonColor = (index: number): string => {
    const colors = [
      '#3b82f6', // Bleu
      '#10b981', // Vert
      '#f59e0b', // Orange
      '#ef4444', // Rouge
      '#8b5cf6'  // Violet
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <section className="control-panel-reason-distribution">
        <h3 className="control-panel-section-title">{t('home:dashboard.reasonDistribution')}</h3>
        <div className="reason-distribution-loading">
          <div className="loading-skeleton">
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="control-panel-reason-distribution">
        <h3 className="control-panel-section-title">{t('home:dashboard.reasonDistribution')}</h3>
        <div className="reason-distribution-error">
          <span className="error-text">{error}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="control-panel-reason-distribution">
      <h3 className="control-panel-section-title">{t('home:dashboard.reasonDistribution')}</h3>
      <div className="reason-distribution-content">
        {reasonData.length > 0 ? (
          <div className="reason-bars">
            {reasonData.map((item, index) => (
              <div key={item.reason} className="reason-bar-item">
                <div className="reason-bar-header">
                  <span className="reason-label">{getReasonLabel(item.reason)}</span>
                  <span className="reason-percentage">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="reason-bar-container">
                  <div 
                    className="reason-bar-fill"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: getReasonColor(index)
                    }}
                  ></div>
                </div>
                <div className="reason-count">
                  {item.count} {item.count === 1 ? 'appel' : 'appels'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reason-data">
            <span className="no-data-text">Aucune donnée disponible</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardCallReasonDistribution;