// src/modules/call-logs/pages/CallLogDetailPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import CallLogService from "../CallLogService";
import { CallLogDetailView, CallLogStatus, CallbackPreference } from "../CallLogModel";
import { toast } from "react-hot-toast";

const CallLogDetailPage: React.FC = () => {
  const { t } = useTranslation("call-logs");
  const { clinicId, callLogId } = useParams<{ clinicId: string; callLogId: string }>();
  const [callLog, setCallLog] = useState<CallLogDetailView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<CallLogStatus>('NEW');
  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    if (!callLogId) return;
    setLoading(true);
    CallLogService.getCallLogById(+callLogId)
      .then((data) => {
        setCallLog(data);
        setStatus(data.status);
        setSummary(data.summary || "");
      })
      .catch((error) => {
        handleAxiosError(error);
        toast.error(t("api_messages.CALL_LOG_NOT_FOUND"));
      })
      .finally(() => setLoading(false));
  }, [callLogId, t]);

  const handleSave = async () => {
    if (!callLogId) return;
    setSaving(true);
    try {
      const updated = await CallLogService.updateCallLog(+callLogId, { status, summary });
      setCallLog(updated);
      toast.success(t("callLogDetail.saveSuccess"));
    } catch (error) {
      handleAxiosError(error);
      toast.error(t("callLogDetail.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <div className="iz_back-link">
          <Link to={`/clinics/${clinicId}/call-logs`}>{t("callLogDetail.backToList")}</Link>
        </div>
        {loading ? (
          <LoadingScreen />
        ) : callLog ? (
          <div className="iz_fields iz_flex">
            <div className="iz_field iz_field-half">
              <label>{t("datatable.id")}</label>
              <span>{callLog.id}</span>
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("datatable.externalCallId")}</label>
              <span>{callLog.external_call_id}</span>
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("callLogDetail.callerInfo")}</label>
              <span>{`${callLog.caller_first_name || ""} ${callLog.caller_last_name || ""}`.trim()}</span>
            </div>
            <div className="iz_field iz_field-half">
              <label>{t("callLogDetail.callInfo")}</label>
              <span>{new Date(callLog.call_started_at).toLocaleString()}</span>
            </div>
              <div className="iz_field iz_field-half">
                <label>{t("callLogDetail.status")}</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as CallLogStatus)}>
                  <option value="NEW">{t("callLogList.statusFilter.NEW")}</option>
                  <option value="IN_PROGRESS">{t("callLogList.statusFilter.IN_PROGRESS")}</option>
                  <option value="DONE">{t("callLogList.statusFilter.DONE")}</option>
                  <option value="ARCHIVED">{t("callLogList.statusFilter.ARCHIVED")}</option>
                </select>
              </div>
            <div className="iz_field iz_field-half">
              <label>{t("callLogDetail.summary")}</label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="iz_field iz_field-full">
              <button
                type="button"
                className="iz_btn iz_btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {t("button.submit")}
              </button>
            </div>
            {callLog.audio_recording_url && (
              <div className="iz_field iz_field-full">
                <label>{t("callLogDetail.audioRecording")}</label>
                <audio controls src={callLog.audio_recording_url} />
              </div>
            )}
            {callLog.full_conversation_json && (
              <div className="iz_field iz_field-full">
                <label>{t("callLogDetail.fullConversation")}</label>
                <pre>{JSON.stringify(callLog.full_conversation_json, null, 2)}</pre>
              </div>
            )}
            {callLog.raw_structured_data && (
              <div className="iz_field iz_field-full">
                <label>{t("callLogDetail.rawData")}</label>
                <pre>{JSON.stringify(callLog.raw_structured_data, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : (
          <p>{t("api_messages.CALL_LOG_NOT_FOUND")}</p>
        )}
      </div>
    </div>
  );
};

export default CallLogDetailPage;