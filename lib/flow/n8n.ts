import { ValidAvailabilityRequest, ValidMeetingRequest } from "./validation";

export interface N8nProxyResult<T = unknown> {
  ok: boolean;
  status: number;
  body: T;
}

async function readJsonOrText(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function addSharedHeaders(headers: Headers): void {
  if (process.env.FLOWNEX_N8N_WEBHOOK_SECRET) {
    headers.set("x-flownex-webhook-secret", process.env.FLOWNEX_N8N_WEBHOOK_SECRET);
  }
}

function mapN8nError(error: unknown): N8nProxyResult {
  const message = error instanceof Error ? error.message : "n8n request failed.";
  return {
    ok: false,
    status: message.includes("aborted") ? 504 : 503,
    body: {
      success: false,
      error: message.includes("aborted") ? "upstream_timeout" : "service_unavailable",
      message: "FlowNex automation is temporarily unavailable.",
    },
  };
}

export async function requestAvailabilityFromN8n(payload: ValidAvailabilityRequest): Promise<N8nProxyResult> {
  const webhookUrl = process.env.FLOWNEX_N8N_AVAILABILITY_URL;
  if (!webhookUrl) {
    return {
      ok: false,
      status: 503,
      body: {
        success: false,
        error: "configuration_required",
        message: "FLOWNEX_N8N_AVAILABILITY_URL is not configured.",
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  const headers = new Headers({ "content-type": "application/json" });
  addSharedHeaders(headers);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        date: payload.date,
        time: payload.time,
        timezone: payload.timezone,
        slot: payload.slot,
      }),
      signal: controller.signal,
    });

    return {
      ok: response.ok,
      status: response.status,
      body: await readJsonOrText(response),
    };
  } catch (error) {
    return mapN8nError(error);
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitMeetingRequestToN8n(payload: ValidMeetingRequest): Promise<N8nProxyResult> {
  const webhookUrl = process.env.FLOWNEX_N8N_MEETING_REQUEST_URL;
  if (!webhookUrl) {
    return {
      ok: false,
      status: 503,
      body: {
        success: false,
        error: "configuration_required",
        message: "FLOWNEX_N8N_MEETING_REQUEST_URL is not configured.",
      },
    };
  }

  const formData = new FormData();
  formData.set("leadId", payload.leadId);
  formData.set("idempotencyKey", payload.idempotencyKey);
  formData.set("name", payload.name);
  formData.set("email", payload.email);
  formData.set("preferredDate", payload.preferredDate);
  formData.set("preferredTime", payload.preferredTime);
  formData.set("timezone", payload.timezone);
  formData.set("problem", payload.problem);
  formData.set("urgency", payload.urgency);
  formData.set("improvementAreas", JSON.stringify(payload.improvementAreas));
  formData.set("slot", JSON.stringify(payload.slot));
  formData.set("requestedTimeIST", payload.slot.startIST);

  if (payload.voiceRecordingUrl) formData.set("voiceRecordingUrl", payload.voiceRecordingUrl);
  if (payload.voiceRecordingMimeType) formData.set("voiceRecordingMimeType", payload.voiceRecordingMimeType);
  if (payload.voiceRecordingBytes) formData.set("voiceRecordingBytes", String(payload.voiceRecordingBytes));
  if (process.env.FLOWNEX_PUBLIC_BASE_URL) {
    formData.set("backendBaseUrl", process.env.FLOWNEX_PUBLIC_BASE_URL.replace(/\/$/, ""));
  }

  if (payload.voiceRecording) {
    formData.set("voiceRecording", payload.voiceRecording, payload.voiceRecording.name || "recording.webm");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const headers = new Headers({ "x-flownex-lead-id": payload.leadId });
  addSharedHeaders(headers);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });

    return {
      ok: response.ok,
      status: response.status,
      body: await readJsonOrText(response),
    };
  } catch (error) {
    return mapN8nError(error);
  } finally {
    clearTimeout(timeout);
  }
}
