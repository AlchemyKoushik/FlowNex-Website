import crypto from "crypto";
import { assertTimezone, buildSlotInstant, isFutureSlot, SlotInstant } from "./time";
import {
  IMPROVEMENT_AREAS,
  ImprovementAreas,
  URGENCY_VALUES,
  Urgency,
} from "./validation-internal";

export const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

export const ALLOWED_AUDIO_MIME_TYPES = new Set([
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/ogg",
  "audio/ogg;codecs=opus",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/x-wav",
]);

export interface ValidMeetingRequest {
  leadId: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  problem: string;
  improvementAreas: string[];
  urgency: Urgency | "";
  voiceRecording: File | null;
  voiceRecordingUrl?: string | null;
  voiceRecordingMimeType?: string | null;
  voiceRecordingBytes?: number | null;
  idempotencyKey: string;
  slot: SlotInstant;
}

export interface ValidAvailabilityRequest {
  date: string;
  time: string;
  timezone: string;
  slot: SlotInstant;
}

export class ValidationError extends Error {
  constructor(
    public readonly code: "validation_error" | "unsupported_media_type" | "payload_too_large",
    message: string,
    public readonly details: Record<string, string> = {},
  ) {
    super(message);
  }
}

function firstText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseAreas(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    return raw.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function normalizeMimeType(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

type DigestMeetingRequest = Pick<
  ValidMeetingRequest,
  "name" | "email" | "preferredDate" | "preferredTime" | "timezone" | "problem" | "improvementAreas" | "urgency"
>;

function digestPayload(values: DigestMeetingRequest, audio?: File | null): string {
  const stable = JSON.stringify({
    name: values.name,
    email: values.email,
    preferredDate: values.preferredDate,
    preferredTime: values.preferredTime,
    timezone: values.timezone,
    problem: values.problem,
    improvementAreas: [...values.improvementAreas].sort(),
    urgency: values.urgency,
    audioName: audio?.name || "",
    audioSize: audio?.size || 0,
    audioType: audio?.type || "",
  });
  return crypto.createHash("sha256").update(stable).digest("hex");
}

export function validateMeetingFormData(formData: FormData): ValidMeetingRequest {
  const details: Record<string, string> = {};
  const leadId = firstText(formData, "leadId");
  const name = firstText(formData, "name");
  const email = firstText(formData, "email").toLowerCase();
  const preferredDate = firstText(formData, "preferredDate");
  const preferredTime = firstText(formData, "preferredTime");
  const timezone = firstText(formData, "timezone");
  const problem = firstText(formData, "problem");
  const urgency = firstText(formData, "urgency").toUpperCase();
  const improvementAreas = parseAreas(firstText(formData, "improvementAreas"));
  const voiceValue = formData.get("voiceRecording");
  const voiceRecording = voiceValue instanceof File && voiceValue.size > 0 ? voiceValue : null;

  if (name.length < 2 || name.length > 120) details.name = "Name must be between 2 and 120 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) details.email = "Email must be valid.";
  if (!isValidDate(preferredDate)) details.preferredDate = "Preferred date must use YYYY-MM-DD.";
  if (isValidDate(preferredDate) && preferredDate < new Date().toISOString().slice(0, 10)) {
    details.preferredDate = "Preferred date cannot be in the past.";
  }
  if (!isValidTime(preferredTime)) details.preferredTime = "Preferred time must use HH:mm in 24-hour time.";
  if (leadId && !/^FN-\d{4}-\d{6}$/.test(leadId)) details.leadId = "Lead ID must match FN-YYYY-000001 format.";
  if (!assertTimezone(timezone)) details.timezone = "Timezone must be a valid IANA timezone.";
  if (isValidDate(preferredDate) && isValidTime(preferredTime) && assertTimezone(timezone) && !isFutureSlot(preferredDate, preferredTime, timezone)) {
    details.preferredTime = "Requested date/time cannot be in the past.";
  }
  if (problem.length > 4000) details.problem = "Problem must be 4000 characters or fewer.";
  if (urgency && !URGENCY_VALUES.includes(urgency as Urgency)) details.urgency = "Urgency must be LOW, NORMAL, HIGH, or ASAP.";

  const invalidAreas = improvementAreas.filter(
    (area) => !IMPROVEMENT_AREAS.includes(area as ImprovementAreas),
  );
  if (invalidAreas.length > 0) details.improvementAreas = `Unsupported improvement area: ${invalidAreas.join(", ")}.`;

  if (Object.keys(details).length > 0) {
    throw new ValidationError("validation_error", "The meeting request contains invalid fields.", details);
  }

  if (voiceRecording) {
    const mimeType = normalizeMimeType(voiceRecording.type || "");
    if (!ALLOWED_AUDIO_MIME_TYPES.has(mimeType)) {
      throw new ValidationError("unsupported_media_type", "The voice recording type is not supported.", {
        voiceRecording: `Received ${voiceRecording.type || "unknown"}.`,
      });
    }
    if (voiceRecording.size > MAX_AUDIO_BYTES) {
      throw new ValidationError("payload_too_large", "The voice recording is larger than the allowed 15 MB limit.", {
        voiceRecording: `${voiceRecording.size} bytes`,
      });
    }
  }

  if (!problem && !voiceRecording) {
    throw new ValidationError("validation_error", "Provide a written problem, a voice recording, or both.", {
      problem: "Problem is required when no voice recording is attached.",
      voiceRecording: "Voice recording is required when no written problem is provided.",
    });
  }

  const validated = {
    leadId,
    name,
    email,
    preferredDate,
    preferredTime,
    timezone,
    problem,
    improvementAreas,
    urgency: urgency as Urgency | "",
  };

  const explicitKey = firstText(formData, "idempotencyKey");

  const slot = buildSlotInstant(preferredDate, preferredTime, timezone);
  if (!slot) {
    throw new ValidationError("validation_error", "The requested date/time is not valid in the selected timezone.", {
      preferredTime: "Requested local time could not be resolved.",
    });
  }

  return {
    ...validated,
    voiceRecording,
    idempotencyKey: explicitKey || digestPayload(validated, voiceRecording),
    slot,
  };
}

export async function validateAvailabilityRequest(request: Request): Promise<ValidAvailabilityRequest> {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const date = String(body?.date ?? body?.preferredDate ?? "").trim();
  const time = String(body?.time ?? body?.preferredTime ?? "").trim();
  const timezone = String(body?.timezone ?? body?.clientTimezone ?? "").trim();
  const details: Record<string, string> = {};

  if (!isValidDate(date)) details.date = "Date must use YYYY-MM-DD.";
  if (!isValidTime(time)) details.time = "Time must use HH:mm in 24-hour time.";
  if (!assertTimezone(timezone)) details.timezone = "Timezone must be a valid IANA timezone.";
  if (isValidDate(date) && isValidTime(time) && assertTimezone(timezone) && !isFutureSlot(date, time, timezone)) {
    details.time = "Requested date/time cannot be in the past.";
  }

  if (Object.keys(details).length > 0) {
    throw new ValidationError("validation_error", "The availability request contains invalid fields.", details);
  }

  const slot = buildSlotInstant(date, time, timezone);
  if (!slot) {
    throw new ValidationError("validation_error", "The requested date/time is not valid in the selected timezone.", {
      time: "Requested local time could not be resolved.",
    });
  }

  return { date, time, timezone, slot };
}
