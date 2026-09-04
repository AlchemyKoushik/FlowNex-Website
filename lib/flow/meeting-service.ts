import { submitMeetingRequestToN8n } from "./n8n";
import { saveVoiceRecording } from "./audio";
import { getLeadByIdempotencyKey, reserveLeadId, saveLead, trace } from "./storage";
import { FlowNexLead, MeetingRequestAcceptedResponse, MeetingRequestErrorResponse } from "./types";
import { ValidMeetingRequest } from "./validation";

export class MeetingRequestServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: MeetingRequestErrorResponse,
  ) {
    super(body.message);
  }
}

function baseLead(request: ValidMeetingRequest, leadId: string, now: string): FlowNexLead {
  return {
    leadId,
    idempotencyKey: request.idempotencyKey,
    name: request.name,
    email: request.email,
    preferredDate: request.preferredDate,
    preferredTime: request.preferredTime,
    timezone: request.timezone,
    requestedTimeIST: request.slot.startIST,
    problem: request.problem,
    improvementAreas: request.improvementAreas,
    urgency: request.urgency,
    voiceRecordingUrl: request.voiceRecordingUrl || null,
    voiceRecordingMimeType: request.voiceRecordingMimeType || request.voiceRecording?.type || null,
    voiceRecordingBytes: request.voiceRecordingBytes || request.voiceRecording?.size || null,
    submittedAt: now,
    updatedAt: now,
    meetingStatus: "PENDING",
    meetingLink: null,
    calendarEventId: null,
    meetingStart: request.slot.startUtc,
    meetingEnd: request.slot.endUtc,
    invitationStatus: "PENDING",
    acceptedAt: null,
    processingStatus: "PROCESSING",
    errorStatus: null,
    source: "website",
    trace: [trace("received"), trace("validated"), trace("n8n_final_submission_started")],
  };
}

export async function processMeetingRequest(request: ValidMeetingRequest): Promise<MeetingRequestAcceptedResponse> {
  const duplicate = await getLeadByIdempotencyKey(request.idempotencyKey);
  if (duplicate) {
    duplicate.trace.push(trace("duplicate_submission_returned"));
    duplicate.updatedAt = new Date().toISOString();
    await saveLead(duplicate);
    return {
      success: true,
      leadId: duplicate.leadId,
      status: duplicate.processingStatus,
      processingStatus: duplicate.processingStatus,
      meetingStatus: duplicate.meetingStatus,
      invitationStatus: duplicate.invitationStatus,
      message: "This request was already received. Returning the existing FlowNex Lead ID.",
      duplicate: true,
      meetingLink: duplicate.meetingLink,
      calendarEventId: duplicate.calendarEventId,
    };
  }

  const leadId = request.leadId || await reserveLeadId(request.idempotencyKey);
  request.leadId = leadId;

  if (request.voiceRecording) {
    const storedRecording = await saveVoiceRecording(leadId, request.voiceRecording);
    request.voiceRecordingUrl = storedRecording.url;
    request.voiceRecordingMimeType = storedRecording.mimeType;
    request.voiceRecordingBytes = storedRecording.bytes;
  }

  const now = new Date().toISOString();
  const lead = baseLead(request, leadId, now);
  await saveLead(lead);

  const n8nResponse = await submitMeetingRequestToN8n(request);
  if (!n8nResponse.ok) {
    lead.processingStatus = "FAILED";
    lead.errorStatus = JSON.stringify(n8nResponse.body).slice(0, 1000);
    lead.trace.push(trace("n8n_final_submission_failed", `HTTP ${n8nResponse.status}`));
    lead.updatedAt = new Date().toISOString();
    await saveLead(lead);
    throw new MeetingRequestServiceError(n8nResponse.status, n8nResponse.body as MeetingRequestErrorResponse);
  }

  const body = n8nResponse.body as Record<string, unknown>;
  lead.processingStatus = "COMPLETED";
  lead.meetingStatus = String(body.meetingStatus || body.status || "PENDING") as FlowNexLead["meetingStatus"];
  lead.invitationStatus = String(body.invitationStatus || "PENDING") as FlowNexLead["invitationStatus"];
  lead.meetingLink = typeof body.meetingLink === "string" ? body.meetingLink : null;
  lead.calendarEventId = typeof body.calendarEventId === "string" ? body.calendarEventId : null;
  lead.voiceRecordingUrl = typeof body.voiceRecordingUrl === "string" ? body.voiceRecordingUrl : null;
  lead.trace.push(trace("n8n_final_submission_completed"));
  lead.updatedAt = new Date().toISOString();
  await saveLead(lead);

  return {
    success: true,
    leadId,
    status: lead.meetingStatus,
    processingStatus: lead.processingStatus,
    meetingStatus: lead.meetingStatus,
    invitationStatus: lead.invitationStatus,
    message: String(body.message || "Meeting request submitted and automation completed."),
    duplicate: false,
    meetingLink: lead.meetingLink,
    calendarEventId: lead.calendarEventId,
  };
}
