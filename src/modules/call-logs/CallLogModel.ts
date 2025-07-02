// src/modules/call-logs/CallLogModel.ts
// Interfaces for Call Logs feature, based on spec-call.md definitions.

// Clinic info for call log context (matching OpenAPI ClinicRead)
export interface ClinicRead {
  id: string; // UUID format in OpenAPI
  name: string;
  created_at: string;
  updated_at?: string | null;
}

// User info for call log context (matching OpenAPI UserInClinicRead)
export interface UserInClinicRead {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status?: string | null;
}

// Enum types for call logs (matching OpenAPI)
export type CallLogReasonForCall = 
  | 'New Appointment'
  | 'Cancellation' 
  | 'Reschedule'
  | 'General Message'
  | 'Emergency'
  | 'Other';

export type CallbackPreference =
  | 'Morning'
  | 'Afternoon'
  | 'Evening'
  | 'Anytime';

export type CallLogStatus = 'New' | 'In Progress' | 'Done' | 'Archived';

// View for listing call logs (matching OpenAPI CallLogListView)
export interface CallLogListView {
  id: string; // UUID format in OpenAPI
  external_call_id: string;
  caller_first_name?: string | null;
  caller_last_name?: string | null;
  caller_phone_number: string;
  call_started_at: string;
  reason_for_call?: CallLogReasonForCall | null;
  status: CallLogStatus;
  summary?: string | null; // Added for dashboard summary
  audio_recording_url?: string | null; // Added for dashboard audio playback
  clinic: ClinicRead;
}

// Detailed view for a single call log (matching OpenAPI CallLogDetailView)
export interface CallLogDetailView extends CallLogListView {
  caller_first_name?: string | null;
  caller_last_name?: string | null;
  caller_phone_number: string;
  is_existing_patient?: boolean | null;
  call_started_at: string;
  call_ended_at?: string | null;
  call_duration_seconds?: number | null;
  reason_for_call?: CallLogReasonForCall | null;
  callback_preference?: CallbackPreference | null;
  summary?: string | null;
  detailed_reason?: string | null;
  preferred_dentist?: string | null;
  audio_recording_url?: string | null;
  cost?: string | null; // String in OpenAPI
  ended_reason?: string | null;
  transcript_text?: string | null;
  full_conversation_json?: any | null;
  raw_structured_data?: any | null;
  external_call_id: string;
  status: CallLogStatus;
  created_at: string;
  updated_at?: string | null;
  clinic: ClinicRead;
  updated_by?: UserInClinicRead | null;
}