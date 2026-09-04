export const MEETING_STATUSES = [
  "PENDING",
  "INVITE_SENT",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
  "RESCHEDULE_REQUIRED",
  "ERROR",
] as const;

export const PROCESSING_STATUSES = [
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "CONFIGURATION_REQUIRED",
] as const;

export const INVITATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
] as const;

export const URGENCY_VALUES = ["LOW", "NORMAL", "HIGH", "ASAP"] as const;

export const IMPROVEMENT_AREAS = [
  "Sales",
  "CRM",
  "Reporting",
  "Internal Operations",
  "Data",
  "Customer Support",
  "Approvals",
  "Something Else",
] as const;

export type MeetingStatus = (typeof MEETING_STATUSES)[number];
export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number];
export type InvitationStatus = (typeof INVITATION_STATUSES)[number];
export type Urgency = (typeof URGENCY_VALUES)[number];

export interface LeadTraceEvent {
  event: string;
  at: string;
  detail?: string;
}

export interface FlowNexLead {
  leadId: string;
  idempotencyKey: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  requestedTimeIST: string;
  problem: string;
  improvementAreas: string[];
  urgency: Urgency | "";
  voiceRecordingUrl: string | null;
  voiceRecordingMimeType: string | null;
  voiceRecordingBytes: number | null;
  submittedAt: string;
  updatedAt: string;
  meetingStatus: MeetingStatus;
  meetingLink: string | null;
  calendarEventId: string | null;
  meetingStart: string | null;
  meetingEnd: string | null;
  invitationStatus: InvitationStatus;
  acceptedAt: string | null;
  processingStatus: ProcessingStatus;
  errorStatus: string | null;
  source: "website";
  trace: LeadTraceEvent[];
}

export interface MeetingRequestAcceptedResponse {
  success: true;
  leadId: string;
  status: MeetingStatus | ProcessingStatus;
  processingStatus: ProcessingStatus;
  meetingStatus: MeetingStatus;
  invitationStatus: InvitationStatus;
  message: string;
  duplicate: boolean;
  meetingLink?: string | null;
  calendarEventId?: string | null;
  warnings?: string[];
}

export interface MeetingRequestErrorResponse {
  success: false;
  error:
    | "validation_error"
    | "unsupported_media_type"
    | "payload_too_large"
    | "configuration_required"
    | "slot_unavailable"
    | "duplicate_conflict"
    | "upstream_timeout"
    | "service_unavailable"
    | "internal_error";
  message: string;
  details?: Record<string, string>;
}
