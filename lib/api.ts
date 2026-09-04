export interface MeetingRequestPayload {
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  problem: string;
  urgency: string;
  improvementAreas: string[];
  voiceRecording?: Blob | null;
}

export interface MeetingRequestResponse {
  success: boolean;
  leadId?: string;
  status?: string;
  message?: string;
  processingStatus?: string;
  meetingStatus?: string;
  invitationStatus?: string;
  duplicate?: boolean;
  warnings?: string[];
  details?: Record<string, string>;
}

export interface AvailabilityRequestPayload {
  date: string;
  time: string;
  timezone: string;
}

export interface AvailabilityResponse {
  success: boolean;
  available: boolean;
  requested?: {
    startUtc: string;
    endUtc: string;
    startIST: string;
    endIST: string;
  };
  alternatives?: string[];
}

export async function checkAvailability(
  payload: AvailabilityRequestPayload
): Promise<AvailabilityResponse> {
  const res = await fetch("/api/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const response = await res.json().catch(() => ({
    success: false,
    available: false,
    message: "The backend returned a non-JSON response.",
  }));

  if (!res.ok && !response?.success) {
    return response;
  }

  return response;
}

export async function submitMeetingRequest(
  payload: MeetingRequestPayload
): Promise<MeetingRequestResponse> {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("preferredDate", payload.preferredDate);
  formData.append("preferredTime", payload.preferredTime);
  formData.append("timezone", payload.timezone);
  formData.append("problem", payload.problem);
  formData.append("urgency", payload.urgency);
  formData.append("improvementAreas", JSON.stringify(payload.improvementAreas));

  if (payload.voiceRecording) {
    formData.append("voiceRecording", payload.voiceRecording, "recording.webm");
  }

  const res = await fetch("/api/meeting-request", {
    method: "POST",
    body: formData,
  });

  const response = await res.json().catch(() => ({
    success: false,
    message: "The backend returned a non-JSON response.",
  }));

  if (!res.ok && !response?.success) {
    return response;
  }

  return response;
}
