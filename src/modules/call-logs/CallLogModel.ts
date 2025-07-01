// src/modules/call-logs/CallLogModel.ts
// Interfaces for Call Logs feature, based on spec-call.md definitions.

// Clinic info for call log context
export interface ClinicRead {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Enum types for call logs
export type CallLogReasonForCall =
  | 'NEW_APPOINTMENT'
  | 'CANCELLATION'
  | 'RESCHEDULE'
  | 'GENERAL_MESSAGE'
  | 'EMERGENCY'
  | 'OTHER';

export type CallbackPreference =
  | 'MORNING'
  | 'AFTERNOON'
  | 'EVENING'
  | 'ANYTIME';

export type CallLogStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';

// View for listing call logs
export interface CallLogListView {
  id: number;
  external_call_id: string;
  caller_first_name?: string | null;
  caller_last_name?: string | null;
  caller_phone_number: string;
  call_started_at: string;
  reason_for_call?: CallLogReasonForCall | null;
  status: CallLogStatus;
  clinic: ClinicRead;
}

// Detailed view for a single call log
export interface CallLogDetailView extends CallLogListView {
  call_ended_at?: string | null;
  call_duration_seconds?: number | null;
  callback_preference?: CallbackPreference | null;
  summary?: string | null;
  detailed_reason?: string | null;
  preferred_dentist?: string | null;
  full_conversation_json?: any | null;
  raw_structured_data?: any | null;
  transcript_text?: string | null;
  audio_recording_url?: string | null;
  cost?: number | null;
  ended_reason?: string | null;
  created_at: string;
  updated_at?: string | null;
}