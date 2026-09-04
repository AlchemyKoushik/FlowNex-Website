import { workflow, node, trigger, ifElse, sticky, newCredential, expr } from "@n8n/workflow-sdk";

const requestWebhook = trigger({
  type: "n8n-nodes-base.webhook",
  version: 2.1,
  config: {
    name: "Meeting Request Webhook",
    parameters: {
      httpMethod: "POST",
      path: "flownex/meeting-request",
      authentication: "none",
      responseMode: "responseNode",
      options: { binaryData: true, binaryPropertyName: "voiceRecording" },
    },
  },
  output: [{ body: { leadId: "FN-2026-000001", name: "Jane Client", email: "jane@example.com", preferredDate: "2026-09-15", preferredTime: "18:30", timezone: "America/New_York", problem: "Need CRM automation" } }],
});

const normalizeRequest = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Normalize Final Request",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: String.raw`
const TEAM_TIMEZONE = 'Asia/Kolkata';
const SLOT_MINUTES = 60;
const STEP_MINUTES = 30;
const MAX_ALTERNATIVES = 5;
const BUSINESS_START_MINUTE = 10 * 60;
const BUSINESS_END_MINUTE = 19 * 60;

function isDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00.000Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function isTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isTimezone(value) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return Boolean(value && value.length <= 80);
  } catch {
    return false;
  }
}

function partsFor(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return Object.fromEntries(formatter.formatToParts(date).filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value === '24' ? '0' : part.value)]));
}

function offsetMsAt(utcDate, timeZone) {
  const parts = partsFor(utcDate, timeZone);
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - utcDate.getTime();
}

function zonedWallTimeToUtc(date, time, timeZone) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const guessedUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const firstPass = new Date(guessedUtc.getTime() - offsetMsAt(guessedUtc, timeZone));
  const secondPass = new Date(guessedUtc.getTime() - offsetMsAt(firstPass, timeZone));
  const rendered = partsFor(secondPass, timeZone);
  if (rendered.year !== year || rendered.month !== month || rendered.day !== day || rendered.hour !== hour || rendered.minute !== minute) return null;
  return secondPass;
}

function format(date, timeZone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date).replace(', ', 'T');
}

function businessMinutes(date) {
  const parts = partsFor(date, TEAM_TIMEZONE);
  return parts.hour * 60 + parts.minute;
}

function safeName(value) {
  return String(value || 'Client').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) || 'Client';
}

const input = $input.first();
const body = input.json?.body ?? input.json ?? {};
const binary = input.binary ?? {};
const binaryKey = Object.keys(binary)[0];
const sourceFile = binaryKey ? binary[binaryKey] : null;
const leadId = String(body.leadId ?? '').trim();
const name = String(body.name ?? '').trim();
const email = String(body.email ?? '').trim().toLowerCase();
const preferredDate = String(body.preferredDate ?? body.date ?? '').trim();
const preferredTime = String(body.preferredTime ?? body.time ?? '').trim();
const timezone = String(body.timezone ?? body.clientTimezone ?? '').trim();
const problem = String(body.problem ?? '').trim();
const idempotencyKey = String(body.idempotencyKey ?? leadId).trim();
const details = {};
if (!/^FN-\d{4}-\d{6}$/.test(leadId)) details.leadId = 'Lead ID must match FN-YYYY-000001.';
if (name.length < 2 || name.length > 120) details.name = 'Name must be between 2 and 120 characters.';
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) details.email = 'Email must be valid.';
if (!isDate(preferredDate)) details.preferredDate = 'Preferred date must use YYYY-MM-DD.';
if (!isTime(preferredTime)) details.preferredTime = 'Preferred time must use HH:mm in 24-hour time.';
if (!isTimezone(timezone)) details.timezone = 'Timezone must be a valid IANA timezone.';
if (!problem && !sourceFile) details.problem = 'Provide written problem, voice recording, or both.';

let start = null;
if (!Object.keys(details).length) {
  start = zonedWallTimeToUtc(preferredDate, preferredTime, timezone);
  if (!start) details.preferredTime = 'Requested local time could not be resolved.';
  else if (start.getTime() <= Date.now()) details.preferredTime = 'Requested date/time cannot be in the past.';
}

if (Object.keys(details).length) {
  return [{ json: { valid: false, statusCode: 422, response: { success: false, error: 'validation_error', message: 'The final meeting request contains invalid fields.', details } } }];
}

const end = new Date(start.getTime() + SLOT_MINUTES * 60000);
const nextDay = new Date(preferredDate + 'T00:00:00.000Z');
nextDay.setUTCDate(nextDay.getUTCDate() + 1);
const clientDayEndDate = nextDay.toISOString().slice(0, 10);
const dayStart = zonedWallTimeToUtc(preferredDate, '00:00', timezone);
const dayEnd = zonedWallTimeToUtc(clientDayEndDate, '00:00', timezone);
const startBusinessMinute = businessMinutes(start);
const endBusinessMinute = businessMinutes(new Date(end.getTime() - 1));
const ext = String(sourceFile?.fileExtension || sourceFile?.mimeType?.split('/').pop() || 'webm').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'webm';
const driveFileName = leadId + ' - ' + safeName(name) + ' - Voice Recording.' + (ext === 'xwav' ? 'wav' : ext);
const eventId = leadId.toLowerCase().replace(/[^a-v0-9]/g, '');
const json = {
  valid: true,
  leadId,
  idempotencyKey,
  name,
  email,
  preferredDate,
  preferredTime,
  timezone,
  problem,
  urgency: String(body.urgency ?? '').trim(),
  improvementAreas: (() => { try { const parsed = JSON.parse(String(body.improvementAreas ?? '[]')); return Array.isArray(parsed) ? parsed.join(', ') : String(body.improvementAreas ?? ''); } catch { return String(body.improvementAreas ?? ''); } })(),
  requestedStartUtc: start.toISOString(),
  requestedEndUtc: end.toISOString(),
  requestedTimeIST: format(start, TEAM_TIMEZONE),
  clientDayStartUtc: dayStart.toISOString(),
  clientDayEndUtc: dayEnd.toISOString(),
  requestedWithinBusinessHours: startBusinessMinute >= BUSINESS_START_MINUTE && endBusinessMinute <= BUSINESS_END_MINUTE,
  teamTimezone: TEAM_TIMEZONE,
  slotMinutes: SLOT_MINUTES,
  stepMinutes: STEP_MINUTES,
  maxAlternatives: MAX_ALTERNATIVES,
  businessStartMinute: BUSINESS_START_MINUTE,
  businessEndMinute: BUSINESS_END_MINUTE,
  hasAudio: Boolean(sourceFile),
  driveFileName,
  eventId,
  submittedAt: new Date().toISOString(),
};
const output = { json };
if (sourceFile) output.binary = { data: { ...sourceFile, fileName: driveFileName } };
return [output];
`,
    },
  },
  output: [{ valid: true, leadId: "FN-2026-000001", hasAudio: true, requestedStartUtc: "2026-09-15T22:30:00.000Z" }],
});

const finalPayloadValid = ifElse({
  version: 2.3,
  config: {
    name: "Final Payload Valid?",
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 },
        conditions: [{ leftValue: expr("{{ $json.valid }}"), operator: { type: "boolean", operation: "true" }, rightValue: true }],
        combinator: "and",
      },
    },
  },
});

const respondFinalValidation = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Respond Final Validation Error",
    parameters: {
      respondWith: "json",
      responseBody: expr('{{ $("Normalize Final Request").item.json.response }}'),
      options: { responseCode: expr('{{ $("Normalize Final Request").item.json.statusCode }}') },
    },
  },
});

const readExistingLeadRows = node({
  type: "n8n-nodes-base.googleSheets",
  version: 4.7,
  config: {
    name: "Read Existing Lead Rows",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    // Google Sheets can return zero items for an empty sheet. Preserve the
    // request item so duplicate detection and the scheduling path still run.
    alwaysOutputData: true,
    parameters: {
      resource: "sheet",
      operation: "read",
      authentication: "oAuth2",
      documentId: { __rl: true, mode: "id", value: "1r3dBdS3yrOraTzPaid2vYA6haiBb5eNzGvifL41t7WE", cachedResultName: "FlowNex Lead Sheet" },
      sheetName: { __rl: true, mode: "list", value: "gid=0", cachedResultName: "Sheet1" },
      options: { dataLocationOnSheet: { values: { rangeDefinition: "detectAutomatically", readRowsUntil: "lastRowInSheet" } }, returnAllMatches: "returnAllMatches" },
    },
    credentials: { googleSheetsOAuth2Api: newCredential("Google Sheets account", "70My8rbEBC7WPcNf") },
  },
  output: [{ "Lead ID": "FN-2026-000001", "Calendar Event ID": "" }],
});

const detectDuplicate = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Detect Existing Final Submission",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: String.raw`
const request = $('Normalize Final Request').item.json;
const rows = $('Read Existing Lead Rows').all().map((item) => item.json);
const existing = rows.find((row) => String(row['Lead ID'] ?? '').trim() === request.leadId);
const hasCalendar = Boolean(String(existing?.['Calendar Event ID'] ?? existing?.['Meeting ID'] ?? '').trim());
const hasMeet = Boolean(String(existing?.['Meeting Link'] ?? '').trim());
return [{ json: { ...request, duplicate: Boolean(existing && (hasCalendar || hasMeet)), existingLead: existing ?? null } }];
`,
    },
  },
  output: [{ leadId: "FN-2026-000001", duplicate: false }],
});

const duplicateFinal = ifElse({
  version: 2.3,
  config: {
    name: "Already Scheduled?",
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 },
        conditions: [{ leftValue: expr("{{ $json.duplicate }}"), operator: { type: "boolean", operation: "true" }, rightValue: true }],
        combinator: "and",
      },
    },
  },
});

const respondDuplicate = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Respond Duplicate Submission",
    parameters: {
      respondWith: "json",
      responseBody: expr('{{ { success: true, duplicate: true, leadId: $("Detect Existing Final Submission").item.json.leadId, meetingStatus: $("Detect Existing Final Submission").item.json.existingLead["Meeting Status"] ?? "INVITE_SENT", invitationStatus: $("Detect Existing Final Submission").item.json.existingLead["Meeting Acceptance Status"] ?? "PENDING", meetingLink: $("Detect Existing Final Submission").item.json.existingLead["Meeting Link"] ?? null, calendarEventId: $("Detect Existing Final Submission").item.json.existingLead["Calendar Event ID"] ?? $("Detect Existing Final Submission").item.json.existingLead["Meeting ID"] ?? null, message: "This meeting request was already scheduled. Returning the existing meeting details." } }}'),
      options: { responseCode: 200 },
    },
  },
});

const recheckCalendarSlot = node({
  type: "n8n-nodes-base.googleCalendar",
  version: 1.3,
  config: {
    name: "Recheck Calendar Slot",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "calendar",
      operation: "availability",
      calendar: { __rl: true, mode: "list", value: "koushiknox@gmail.com", cachedResultName: "koushiknox@gmail.com" },
      timeMin: expr('{{ $("Detect Existing Final Submission").item.json.requestedStartUtc }}'),
      timeMax: expr('{{ $("Detect Existing Final Submission").item.json.requestedEndUtc }}'),
      options: { outputFormat: "availability", timezone: { __rl: true, mode: "list", value: "Asia/Kolkata", cachedResultName: "Asia/Kolkata" } },
    },
    credentials: { googleCalendarOAuth2Api: newCredential("Google Calendar account", "rJPGZyvbAEXk3VOC") },
  },
  output: [{ available: true }],
});

const analyzeRecheck = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Analyze Rechecked Slot",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: "const request = $('Detect Existing Final Submission').item.json;\nconst calendar = $('Recheck Calendar Slot').item.json;\nreturn [{ json: { ...request, available: Boolean(calendar.available) && Boolean(request.requestedWithinBusinessHours) } }];",
    },
  },
  output: [{ leadId: "FN-2026-000001", available: true, hasAudio: true }],
});

const slotStillAvailable = ifElse({
  version: 2.3,
  config: {
    name: "Slot Still Available?",
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 },
        conditions: [{ leftValue: expr("{{ $json.available }}"), operator: { type: "boolean", operation: "true" }, rightValue: true }],
        combinator: "and",
      },
    },
  },
});

const fetchBusyForConflict = node({
  type: "n8n-nodes-base.googleCalendar",
  version: 1.3,
  config: {
    name: "Fetch Busy Slots for Conflict",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "calendar",
      operation: "availability",
      calendar: { __rl: true, mode: "list", value: "koushiknox@gmail.com", cachedResultName: "koushiknox@gmail.com" },
      timeMin: expr('{{ $("Analyze Rechecked Slot").item.json.clientDayStartUtc }}'),
      timeMax: expr('{{ $("Analyze Rechecked Slot").item.json.clientDayEndUtc }}'),
      options: { outputFormat: "bookedSlots", timezone: { __rl: true, mode: "list", value: "Asia/Kolkata", cachedResultName: "Asia/Kolkata" } },
    },
    credentials: { googleCalendarOAuth2Api: newCredential("Google Calendar account", "rJPGZyvbAEXk3VOC") },
  },
  output: [{ start: "2026-09-15T23:00:00.000Z", end: "2026-09-16T00:00:00.000Z" }],
});

const buildConflictResponse = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Build Race Conflict Response",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: String.raw`
const request = $('Analyze Rechecked Slot').item.json;
return [{ json: { success: false, error: 'slot_unavailable', leadId: request.leadId, requestedDate: request.preferredDate, requestedTime: request.preferredTime, clientTimezone: request.timezone, requestedTimeIST: request.requestedTimeIST, alternativeTimes: [], message: 'The requested slot became unavailable. Please run availability again and choose another time.' } }];
`,
    },
  },
  output: [{ success: false, error: "slot_unavailable", alternativeTimes: [] }],
});

const respondConflict = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Respond Slot Conflict",
    parameters: {
      respondWith: "json",
      responseBody: expr("{{ $json }}"),
      options: { responseCode: 409 },
    },
  },
});

const audioAttached = ifElse({
  version: 2.3,
  config: {
    name: "Audio Attached?",
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 },
        conditions: [{ leftValue: expr("{{ $json.hasAudio }}"), operator: { type: "boolean", operation: "true" }, rightValue: true }],
        combinator: "and",
      },
    },
  },
});

const uploadRecording = node({
  type: "n8n-nodes-base.googleDrive",
  version: 3,
  config: {
    name: "Upload Original Recording to Drive",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "file",
      operation: "upload",
      authentication: "oAuth2",
      inputDataFieldName: "data",
      name: expr('{{ $("Analyze Rechecked Slot").item.json.driveFileName }}'),
      driveId: { __rl: true, mode: "list", value: "My Drive", cachedResultName: "My Drive" },
      folderId: { __rl: true, mode: "id", value: "1WScWGGYCxEUjtnCEOhXbfhHYhcYXolsZ", cachedResultName: "FlowNex Solutions" },
      options: {
        appPropertiesUi: { appPropertyValues: [{ key: "leadId", value: expr('{{ $("Analyze Rechecked Slot").item.json.leadId }}') }] },
        simplifyOutput: true,
      },
    },
    credentials: { googleDriveOAuth2Api: newCredential("Koushik's Google Drive OAuth API", "bzdra3dO3sJ1hStg") },
  },
  output: [{ id: "drive-file-id", webViewLink: "https://drive.google.com/file/d/drive-file-id/view" }],
});

const shareRecordingWithClient = node({
  type: "n8n-nodes-base.googleDrive",
  version: 3,
  config: {
    name: "Share Recording With Client",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "file",
      operation: "share",
      authentication: "oAuth2",
      fileId: { __rl: true, mode: "id", value: expr('{{ $("Upload Original Recording to Drive").item.json.id }}'), cachedResultName: "Uploaded recording" },
      permissionsUi: { permissionsValues: { role: "reader", type: "user", emailAddress: expr('{{ $("Analyze Rechecked Slot").item.json.email }}') } },
      options: { sendNotificationEmail: false },
    },
    credentials: { googleDriveOAuth2Api: newCredential("Koushik's Google Drive OAuth API", "bzdra3dO3sJ1hStg") },
  },
  output: [{ id: "permission-id", role: "reader", type: "user" }],
});

const mapSheetWithAudio = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Map Sheet Row With Audio",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: String.raw`
const request = $('Analyze Rechecked Slot').item.json;
const drive = $('Upload Original Recording to Drive').item.json;
const link = drive.webViewLink || drive.webContentLink || (drive.id ? 'https://drive.google.com/file/d/' + drive.id + '/view' : '');
return [{ json: {
  'Lead ID': request.leadId,
  'Name': request.name,
  'Email': request.email,
  'Preferred Date': request.preferredDate,
  'Preferred Time': request.preferredTime,
  'Client Timezone': request.timezone,
  'Timezone': request.timezone,
  'Requested Time IST': request.requestedTimeIST,
  'Problem': request.problem,
  'Voice Recs': link ? '=HYPERLINK("' + link + '","Recording Link")' : '',
  'Voice File Link': link,
  'Meeting Status': 'PENDING',
  'Meeting Link': '',
  'Calendar Event ID': '',
  'Meeting ID': '',
  'Created At': request.submittedAt,
  'Updated At': new Date().toISOString(),
  'Overall Lead Status': 'RECEIVED',
  'Last Error': '',
  'Retry Count': 0,
} }];
`,
    },
  },
  output: [{ "Lead ID": "FN-2026-000001", "Voice Recs": "=HYPERLINK(\"https://drive.google.com/file/d/drive-file-id/view\",\"Recording Link\")" }],
});

const mapSheetWithoutAudio = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Map Sheet Row Without Audio",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: String.raw`
const request = $('Analyze Rechecked Slot').item.json;
return [{ json: {
  'Lead ID': request.leadId,
  'Name': request.name,
  'Email': request.email,
  'Preferred Date': request.preferredDate,
  'Preferred Time': request.preferredTime,
  'Client Timezone': request.timezone,
  'Timezone': request.timezone,
  'Requested Time IST': request.requestedTimeIST,
  'Problem': request.problem,
  'Voice Recs': '',
  'Voice File Link': '',
  'Meeting Status': 'PENDING',
  'Meeting Link': '',
  'Calendar Event ID': '',
  'Meeting ID': '',
  'Created At': request.submittedAt,
  'Updated At': new Date().toISOString(),
  'Overall Lead Status': 'RECEIVED',
  'Last Error': '',
  'Retry Count': 0,
} }];
`,
    },
  },
  output: [{ "Lead ID": "FN-2026-000001", "Voice Recs": "" }],
});

const upsertInitialLead = node({
  type: "n8n-nodes-base.googleSheets",
  version: 4.7,
  config: {
    name: "Upsert Initial Lead Row",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "sheet",
      operation: "appendOrUpdate",
      authentication: "oAuth2",
      documentId: { __rl: true, mode: "id", value: "1r3dBdS3yrOraTzPaid2vYA6haiBb5eNzGvifL41t7WE", cachedResultName: "FlowNex Lead Sheet" },
      sheetName: { __rl: true, mode: "list", value: "gid=0", cachedResultName: "Sheet1" },
      columns: { mappingMode: "autoMapInputData", matchingColumns: ["Lead ID"], value: {}, schema: [{ id: "Lead ID", displayName: "Lead ID", required: true, defaultMatch: true, display: true, type: "string", canBeUsedToMatch: true }] },
      options: { cellFormat: "USER_ENTERED", handlingExtraData: "insertInNewColumn", locationDefine: { values: { headerRow: 1, firstDataRow: 2 } } },
    },
    credentials: { googleSheetsOAuth2Api: newCredential("Google Sheets account", "70My8rbEBC7WPcNf") },
  },
  output: [{ "Lead ID": "FN-2026-000001" }],
});

const createMeetEvent = node({
  type: "n8n-nodes-base.googleCalendar",
  version: 1.3,
  config: {
    name: "Create Calendar Meet Event",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "event",
      operation: "create",
      calendar: { __rl: true, mode: "list", value: "koushiknox@gmail.com", cachedResultName: "koushiknox@gmail.com" },
      start: expr('{{ $("Analyze Rechecked Slot").item.json.requestedStartUtc }}'),
      end: expr('{{ $("Analyze Rechecked Slot").item.json.requestedEndUtc }}'),
      useDefaultReminders: true,
      additionalFields: {
        id: expr('{{ $("Analyze Rechecked Slot").item.json.eventId }}'),
        summary: expr('FlowNex - Discovery Call - {{ $("Analyze Rechecked Slot").item.json.name }}'),
        description: expr('Lead ID: {{ $("Analyze Rechecked Slot").item.json.leadId }}\nClient timezone: {{ $("Analyze Rechecked Slot").item.json.timezone }}\nRequested IST: {{ $("Analyze Rechecked Slot").item.json.requestedTimeIST }}\nProblem: {{ $("Analyze Rechecked Slot").item.json.problem }}'),
        attendees: [expr('{{ $("Analyze Rechecked Slot").item.json.email }}')],
        conferenceDataUi: { conferenceDataValues: { conferenceSolution: "hangoutsMeet" } },
        sendUpdates: "all",
        guestsCanInviteOthers: false,
        guestsCanModify: false,
        guestsCanSeeOtherGuests: true,
        showMeAs: "opaque",
        visibility: "default",
      },
    },
    credentials: { googleCalendarOAuth2Api: newCredential("Google Calendar account", "rJPGZyvbAEXk3VOC") },
  },
  output: [{ id: "calendar-event-id", hangoutLink: "https://meet.google.com/abc-defg-hij", htmlLink: "https://calendar.google.com/event?eid=abc" }],
});

const mapScheduledFields = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Map Scheduled Meeting Fields",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: "const request = $('Analyze Rechecked Slot').item.json;\nconst event = $('Create Calendar Meet Event').item.json;\nreturn [{ json: { 'Lead ID': request.leadId, 'Meeting Status': 'INVITE_SENT', 'Meeting Link': event.hangoutLink || event.htmlLink || '', 'Calendar Event ID': event.id || '', 'Meeting ID': event.id || '', 'Meeting Start': request.requestedStartUtc, 'Meeting End': request.requestedEndUtc, 'Meeting Acceptance Status': 'PENDING', 'Invitation Status': 'PENDING', 'Overall Lead Status': 'MEETING_INVITE_SENT', 'Updated At': new Date().toISOString() } }];",
    },
  },
  output: [{ "Lead ID": "FN-2026-000001", "Meeting Status": "INVITE_SENT", "Calendar Event ID": "calendar-event-id" }],
});

const updateScheduledLead = node({
  type: "n8n-nodes-base.googleSheets",
  version: 4.7,
  config: {
    name: "Update Scheduled Lead Row",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "sheet",
      operation: "appendOrUpdate",
      authentication: "oAuth2",
      documentId: { __rl: true, mode: "id", value: "1r3dBdS3yrOraTzPaid2vYA6haiBb5eNzGvifL41t7WE", cachedResultName: "FlowNex Lead Sheet" },
      sheetName: { __rl: true, mode: "list", value: "gid=0", cachedResultName: "Sheet1" },
      columns: { mappingMode: "autoMapInputData", matchingColumns: ["Lead ID"], value: {}, schema: [{ id: "Lead ID", displayName: "Lead ID", required: true, defaultMatch: true, display: true, type: "string", canBeUsedToMatch: true }] },
      options: { cellFormat: "USER_ENTERED", handlingExtraData: "insertInNewColumn", locationDefine: { values: { headerRow: 1, firstDataRow: 2 } } },
    },
    credentials: { googleSheetsOAuth2Api: newCredential("Google Sheets account", "70My8rbEBC7WPcNf") },
  },
  output: [{ "Lead ID": "FN-2026-000001", "Meeting Status": "INVITE_SENT" }],
});

const respondMeetingScheduled = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Respond Meeting Scheduled",
    parameters: {
      respondWith: "json",
      responseBody: expr('{{ { success: true, duplicate: false, leadId: $("Analyze Rechecked Slot").item.json.leadId, status: "INVITE_SENT", meetingStatus: "INVITE_SENT", invitationStatus: "PENDING", meetingLink: $("Map Scheduled Meeting Fields").item.json["Meeting Link"], calendarEventId: $("Map Scheduled Meeting Fields").item.json["Calendar Event ID"], message: "Meeting request submitted, original problem inputs preserved, and Google Calendar invitation sent." } }}'),
      options: { responseCode: 200 },
    },
  },
});

const note = sticky("## Final Meeting Request\nThis webhook re-checks Calendar before any final side effect, uploads the original audio to Drive when present, stores written text separately, and creates a Google Meet invite. No transcription node is used.", [normalizeRequest, readExistingLeadRows, recheckCalendarSlot, uploadRecording, upsertInitialLead, createMeetEvent, updateScheduledLead], { color: 4 });

export default workflow("flownex-meeting-request", "FlowNex - Meeting Request")
  .add(requestWebhook)
  .to(normalizeRequest)
  .to(finalPayloadValid
    .onTrue(readExistingLeadRows.to(detectDuplicate).to(duplicateFinal
      .onTrue(respondDuplicate)
      .onFalse(recheckCalendarSlot.to(analyzeRecheck).to(slotStillAvailable
        .onTrue(audioAttached
          .onTrue(uploadRecording.to(shareRecordingWithClient).to(mapSheetWithAudio).to(upsertInitialLead).to(createMeetEvent).to(mapScheduledFields).to(updateScheduledLead).to(respondMeetingScheduled))
          .onFalse(mapSheetWithoutAudio.to(upsertInitialLead).to(createMeetEvent).to(mapScheduledFields).to(updateScheduledLead).to(respondMeetingScheduled)))
        .onFalse(fetchBusyForConflict.to(buildConflictResponse).to(respondConflict)))))
    .onFalse(respondFinalValidation))
  .add(note);
