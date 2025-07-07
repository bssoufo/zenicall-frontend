import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import CallLogService from "../CallLogService";
import { CallLogDetailView, CallLogStatus, CallbackPreference, CallLogReasonForCall } from "../CallLogModel";
import { toast } from "react-hot-toast";
import "./CallLogDetailPage.css";

const CallLogDetailPage: React.FC = () => {
  const { t } = useTranslation(["call-logs", "core"]);
  const { clinicId, callLogId } = useParams<{ clinicId: string; callLogId: string }>();
  const navigate = useNavigate();
  
  const [callLog, setCallLog] = useState<CallLogDetailView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Editable fields
  const [status, setStatus] = useState<CallLogStatus>('NEW');
  const [summary, setSummary] = useState<string>("");
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    conversation: false,
    transcript: false,
    rawData: false
  });

  const fetchCallLog = useCallback(async () => {
    if (!callLogId) {
      setError(t("call-logs:errors.invalidId"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await CallLogService.getCallLogById(callLogId);
      setCallLog(data);
      setStatus(data.status);
      setSummary(data.summary || "");
    } catch (err) {
      console.error("Error fetching call log:", err);
      setError(t("call-logs:errors.fetchFailed"));
      toast.error(t("call-logs:api_messages.CALL_LOG_NOT_FOUND"));
    } finally {
      setLoading(false);
    }
  }, [callLogId, t]);

  useEffect(() => {
    fetchCallLog();
  }, [fetchCallLog]);

  const handleSave = async () => {
    if (!callLogId || !callLog) return;
    
    setSaving(true);
    try {
      const updateData = { status, summary: summary.trim() || null };
      const updated = await CallLogService.updateCallLog(callLogId, updateData);
      setCallLog(updated);
      toast.success(t("call-logs:callLogDetail.saveSuccess"));
    } catch (err) {
      console.error("Error updating call log:", err);
      handleAxiosError(err);
      toast.error(t("call-logs:callLogDetail.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) return t("call-logs:callLogDetail.durationUnknown");
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatCallTime = (startTime: string, endTime?: string | null) => {
    const start = new Date(startTime);
    const startFormatted = start.toLocaleString();
    
    if (endTime) {
      const end = new Date(endTime);
      const endFormatted = end.toLocaleString();
      return `${startFormatted} - ${endFormatted}`;
    }
    
    return startFormatted;
  };

  const getStatusColor = (status: CallLogStatus): string => {
    switch (status) {
      case 'NEW': return '#f59e0b';
      case 'IN_PROGRESS': return '#8b5cf6';
      case 'DONE': return '#10b981';
      case 'ARCHIVED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="call-log-detail-page">
        <LoadingScreen />
      </div>
    );
  }

  if (error || !callLog) {
    return (
      <div className="call-log-detail-page">
        <div className="error-container">
          <div className="error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>{t("call-logs:errors.loadError")}</h2>
            <p>{error || t("call-logs:api_messages.CALL_LOG_NOT_FOUND")}</p>
            <div className="error-actions">
              <button onClick={fetchCallLog} className="retry-btn">
                <i className="fas fa-redo"></i>
                {t("core:common.retry")}
              </button>
              <Link to={`/clinics/${clinicId}/call-logs`} className="back-btn">
                <i className="fas fa-arrow-left"></i>
                {t("call-logs:callLogDetail.backToList")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="call-log-detail-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-navigation">
          <Link to={`/clinics/${clinicId}/call-logs`} className="back-link">
            <i className="fas fa-arrow-left"></i>
            {t("call-logs:callLogDetail.backToList")}
          </Link>
        </div>
        
        <div className="header-content">
          <div className="header-main">
            <h1 className="page-title">
              {t("call-logs:callLogDetail.title")}
            </h1>
            <div className="call-id">
              <span className="label">{t("call-logs:datatable.externalCallId")}:</span>
              <span className="value">{callLog.external_call_id}</span>
            </div>
          </div>
          
          <div className="header-meta">
            <div className="status-badge" style={{ backgroundColor: getStatusColor(callLog.status) }}>
              {callLog.status}
            </div>
            <div className="clinic-name">
              <i className="fas fa-clinic-medical"></i>
              {callLog.clinic.name}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        {/* Caller Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-user"></i>
              {t("call-logs:callLogDetail.callerInfo")}
            </h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>{t("call-logs:datatable.callerFirstName")}</label>
                <span>{callLog.caller_first_name || "-"}</span>
              </div>
              <div className="info-item">
                <label>{t("call-logs:datatable.callerLastName")}</label>
                <span>{callLog.caller_last_name || "-"}</span>
              </div>
              <div className="info-item">
                <label>{t("call-logs:datatable.callerPhoneNumber")}</label>
                <span>
                  <a href={`tel:${callLog.caller_phone_number}`} className="phone-link">
                    <i className="fas fa-phone"></i>
                    {callLog.caller_phone_number}
                  </a>
                </span>
              </div>
              <div className="info-item">
                <label>{t("call-logs:callLogDetail.existingPatient")}</label>
                <span className={`patient-status ${callLog.is_existing_patient ? 'existing' : 'new'}`}>
                  <i className={`fas ${callLog.is_existing_patient ? 'fa-check-circle' : 'fa-user-plus'}`}></i>
                  {callLog.is_existing_patient 
                    ? t("call-logs:callLogDetail.existingPatientYes")
                    : t("call-logs:callLogDetail.existingPatientNo")
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-phone-alt"></i>
              {t("call-logs:callLogDetail.callInfo")}
            </h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item wide">
                <label>{t("call-logs:callLogDetail.callTime")}</label>
                <span>{formatCallTime(callLog.call_started_at, callLog.call_ended_at)}</span>
              </div>
              <div className="info-item">
                <label>{t("call-logs:callLogDetail.duration")}</label>
                <span>{formatDuration(callLog.call_duration_seconds)}</span>
              </div>
              <div className="info-item">
                <label>{t("call-logs:datatable.reasonForCall")}</label>
                <span>{callLog.reason_for_call || "-"}</span>
              </div>
              <div className="info-item">
                <label>{t("call-logs:callLogDetail.callbackPreference")}</label>
                <span>{callLog.callback_preference || "-"}</span>
              </div>
              {callLog.preferred_dentist && (
                <div className="info-item">
                  <label>{t("call-logs:callLogDetail.preferredDentist")}</label>
                  <span>{callLog.preferred_dentist}</span>
                </div>
              )}
              {callLog.cost && (
                <div className="info-item">
                  <label>{t("call-logs:callLogDetail.cost")}</label>
                  <span className="cost-value">${callLog.cost}</span>
                </div>
              )}
              {callLog.ended_reason && (
                <div className="info-item">
                  <label>{t("call-logs:callLogDetail.endedReason")}</label>
                  <span>{callLog.ended_reason}</span>
                </div>
              )}
            </div>
            
            {callLog.detailed_reason && (
              <div className="info-item full-width">
                <label>{t("call-logs:callLogDetail.detailedReason")}</label>
                <div className="detailed-content">
                  {callLog.detailed_reason}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editable Fields Card */}
        <div className="info-card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-edit"></i>
              {t("call-logs:callLogDetail.managementInfo")}
            </h2>
          </div>
          <div className="card-content">
            <div className="edit-grid">
              <div className="edit-item">
                <label htmlFor="status">{t("call-logs:datatable.status")}</label>
                <select 
                  id="status"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as CallLogStatus)}
                  className="status-select"
                >
                  <option value="NEW">{t("call-logs:callLogList.statusFilter.NEW")}</option>
                  <option value="IN_PROGRESS">{t("call-logs:callLogList.statusFilter.IN_PROGRESS")}</option>
                  <option value="DONE">{t("call-logs:callLogList.statusFilter.DONE")}</option>
                  <option value="ARCHIVED">{t("call-logs:callLogList.statusFilter.ARCHIVED")}</option>
                </select>
              </div>
              
              <div className="edit-item full-width">
                <label htmlFor="summary">{t("call-logs:callLogDetail.summary")}</label>
                <textarea
                  id="summary"
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={t("call-logs:callLogDetail.summaryPlaceholder")}
                  className="summary-textarea"
                />
              </div>
            </div>
            
            <div className="save-section">
              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {t("call-logs:callLogDetail.saving")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    {t("call-logs:callLogDetail.save")}
                  </>
                )}
              </button>
              
              {callLog.updated_by && (
                <div className="last-updated">
                  <small>
                    {t("call-logs:callLogDetail.lastUpdatedBy", {
                      user: `${callLog.updated_by.first_name} ${callLog.updated_by.last_name}`,
                      date: callLog.updated_at ? new Date(callLog.updated_at).toLocaleString() : ''
                    })}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Recording */}
        {callLog.audio_recording_url && (
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-volume-up"></i>
                {t("call-logs:callLogDetail.audioRecording")}
              </h2>
            </div>
            <div className="card-content">
              <div className="audio-container">
                <audio controls className="audio-player">
                  <source src={callLog.audio_recording_url} type="audio/mpeg" />
                  <source src={callLog.audio_recording_url} type="audio/wav" />
                  {t("call-logs:callLogDetail.audioNotSupported")}
                </audio>
                <a 
                  href={callLog.audio_recording_url} 
                  download 
                  className="download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-download"></i>
                  {t("call-logs:callLogDetail.downloadAudio")}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Transcript */}
        {callLog.transcript_text && (
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-file-alt"></i>
                {t("call-logs:callLogDetail.transcript")}
              </h2>
              <button 
                className="expand-btn"
                onClick={() => toggleSection('transcript')}
              >
                <i className={`fas fa-chevron-${expandedSections.transcript ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {expandedSections.transcript && (
              <div className="card-content">
                <div className="transcript-container">
                  <pre className="transcript-text">{callLog.transcript_text}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conversation JSON */}
        {callLog.full_conversation_json && (
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-code"></i>
                {t("call-logs:callLogDetail.fullConversation")}
              </h2>
              <button 
                className="expand-btn"
                onClick={() => toggleSection('conversation')}
              >
                <i className={`fas fa-chevron-${expandedSections.conversation ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {expandedSections.conversation && (
              <div className="card-content">
                <div className="json-container">
                  <pre className="json-content">
                    {JSON.stringify(callLog.full_conversation_json, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Raw Data */}
        {callLog.raw_structured_data && (
          <div className="info-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-database"></i>
                {t("call-logs:callLogDetail.rawData")}
              </h2>
              <button 
                className="expand-btn"
                onClick={() => toggleSection('rawData')}
              >
                <i className={`fas fa-chevron-${expandedSections.rawData ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {expandedSections.rawData && (
              <div className="card-content">
                <div className="json-container">
                  <pre className="json-content">
                    {JSON.stringify(callLog.raw_structured_data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metadata Card */}
        <div className="info-card metadata-card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-info-circle"></i>
              {t("call-logs:callLogDetail.metadata")}
            </h2>
          </div>
          <div className="card-content">
            <div className="metadata-grid">
              <div className="metadata-item">
                <label>{t("call-logs:callLogDetail.createdAt")}</label>
                <span>{new Date(callLog.created_at).toLocaleString()}</span>
              </div>
              {callLog.updated_at && (
                <div className="metadata-item">
                  <label>{t("call-logs:callLogDetail.updatedAt")}</label>
                  <span>{new Date(callLog.updated_at).toLocaleString()}</span>
                </div>
              )}
              <div className="metadata-item">
                <label>{t("call-logs:callLogDetail.internalId")}</label>
                <span className="internal-id">{callLog.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallLogDetailPage;