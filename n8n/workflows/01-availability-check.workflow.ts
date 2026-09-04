import { workflow, node, trigger, ifElse, sticky, newCredential, expr } from "@n8n/workflow-sdk";

const availabilityWebhook = trigger({
  type: "n8n-nodes-base.webhook",
  version: 2.1,
  config: {
    name: "Availability Check Webhook",
    parameters: {
      httpMethod: "POST",
      path: "flownex/availability",
      authentication: "none",
      responseMode: "responseNode",
    },
  },
  output: [{ body: { date: "2026-09-15", time: "18:30", timezone: "America/New_York" } }],
});

const validateAvailabilityPayload = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Validate Availability Payload",
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
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return Object.fromEntries(formatter.formatToParts(date)
    .filter((part) => part.type !== 'literal')
    .map((part) => [part.type, Number(part.value === '24' ? '0' : part.value)]));
}

function offsetMsAt(utcDate, timeZone) {
  const parts = partsFor(utcDate, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - utcDate.getTime();
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
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date).replace(', ', 'T');
}

function businessMinutes(date) {
  const parts = partsFor(date, TEAM_TIMEZONE);
  return parts.hour * 60 + parts.minute;
}

const source = items[0]?.json?.body ?? items[0]?.json ?? {};
const date = String(source.date ?? source.preferredDate ?? '').trim();
const time = String(source.time ?? source.preferredTime ?? '').trim();
const timezone = String(source.timezone ?? source.clientTimezone ?? '').trim();
const details = {};
if (!isDate(date)) details.date = 'Date must use YYYY-MM-DD.';
if (!isTime(time)) details.time = 'Time must use HH:mm in 24-hour time.';
if (!isTimezone(timezone)) details.timezone = 'Timezone must be a valid IANA timezone.';

let start = null;
if (!Object.keys(details).length) {
  start = zonedWallTimeToUtc(date, time, timezone);
  if (!start) details.time = 'Requested local time could not be resolved.';
  else if (start.getTime() <= Date.now()) details.time = 'Requested date/time cannot be in the past.';
}

if (Object.keys(details).length) {
  return [{ json: { valid: false, statusCode: 422, response: { success: false, error: 'validation_error', message: 'The availability request contains invalid fields.', details } } }];
}

const end = new Date(start.getTime() + SLOT_MINUTES * 60000);
const dayStart = zonedWallTimeToUtc(date, '00:00', timezone);
const nextDay = new Date(date + 'T00:00:00.000Z');
nextDay.setUTCDate(nextDay.getUTCDate() + 1);
const dayEndDate = nextDay.toISOString().slice(0, 10);
const dayEnd = zonedWallTimeToUtc(dayEndDate, '00:00', timezone);
const startBusinessMinute = businessMinutes(start);
const endBusinessMinute = businessMinutes(new Date(end.getTime() - 1));

return [{ json: {
  valid: true,
  date,
  time,
  timezone,
  teamTimezone: TEAM_TIMEZONE,
  slotMinutes: SLOT_MINUTES,
  stepMinutes: STEP_MINUTES,
  maxAlternatives: MAX_ALTERNATIVES,
  businessStartMinute: BUSINESS_START_MINUTE,
  businessEndMinute: BUSINESS_END_MINUTE,
  requestedStartUtc: start.toISOString(),
  requestedEndUtc: end.toISOString(),
  requestedTimeIST: format(start, TEAM_TIMEZONE),
  clientDayStartUtc: dayStart.toISOString(),
  clientDayEndUtc: dayEnd.toISOString(),
  requestedWithinBusinessHours: startBusinessMinute >= BUSINESS_START_MINUTE && endBusinessMinute <= BUSINESS_END_MINUTE,
} }];
`,
    },
  },
  output: [{ valid: true, requestedStartUtc: "2026-09-15T22:30:00.000Z", requestedEndUtc: "2026-09-15T23:30:00.000Z" }],
});

const payloadValid = ifElse({
  version: 2.3,
  config: {
    name: "Availability Payload Valid?",
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 },
        conditions: [{ leftValue: expr("{{ $json.valid }}"), operator: { type: "boolean", operation: "true" }, rightValue: true }],
        combinator: "and",
      },
    },
  },
});

const respondAvailabilityValidation = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Respond Availability Validation Error",
    parameters: {
      respondWith: "json",
      responseBody: expr('{{ $("Validate Availability Payload").item.json.response }}'),
      options: { responseCode: expr('{{ $("Validate Availability Payload").item.json.statusCode }}') },
    },
  },
});

const checkRequestedCalendar = node({
  type: "n8n-nodes-base.googleCalendar",
  version: 1.3,
  config: {
    name: "Check Requested Calendar Slot",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "calendar",
      operation: "availability",
      calendar: { __rl: true, mode: "list", value: "koushiknox@gmail.com", cachedResultName: "koushiknox@gmail.com" },
      timeMin: expr('{{ $("Validate Availability Payload").item.json.requestedStartUtc }}'),
      timeMax: expr('{{ $("Validate Availability Payload").item.json.requestedEndUtc }}'),
      options: { outputFormat: "availability", timezone: { __rl: true, mode: "list", value: "Asia/Kolkata", cachedResultName: "Asia/Kolkata" } },
    },
    credentials: { googleCalendarOAuth2Api: newCredential("Google Calendar account", "rJPGZyvbAEXk3VOC") },
  },
  output: [{ available: true }],
});

const fetchBusySlots = node({
  type: "n8n-nodes-base.googleCalendar",
  version: 1.3,
  config: {
    name: "Fetch Busy Slots for Client Date",
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    // Google Calendar returns zero items when the day has no busy events. Keep
    // the request in the stream so Build Availability Response can still run.
    alwaysOutputData: true,
    parameters: {
      resource: "calendar",
      operation: "availability",
      calendar: { __rl: true, mode: "list", value: "koushiknox@gmail.com", cachedResultName: "koushiknox@gmail.com" },
      timeMin: expr('{{ $("Validate Availability Payload").item.json.clientDayStartUtc }}'),
      timeMax: expr('{{ $("Validate Availability Payload").item.json.clientDayEndUtc }}'),
      options: { outputFormat: "bookedSlots", timezone: { __rl: true, mode: "list", value: "Asia/Kolkata", cachedResultName: "Asia/Kolkata" } },
    },
    credentials: { googleCalendarOAuth2Api: newCredential("Google Calendar account", "rJPGZyvbAEXk3VOC") },
  },
  output: [{ start: "2026-09-15T23:00:00.000Z", end: "2026-09-16T00:00:00.000Z" }],
});

const buildAvailabilityResponse = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Build Availability Response",
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: String.raw`
const request = $('Validate Availability Payload').item.json;
const requested = $('Check Requested Calendar Slot').item.json;
const busyRaw = $('Fetch Busy Slots for Client Date').all().map((item) => item.json);

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
  return secondPass;
}

function clientTime(date) {
  return new Intl.DateTimeFormat('en-US', { timeZone: request.timezone, hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
}

function clientDate(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: request.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function businessMinutes(date) {
  const parts = partsFor(date, request.teamTimezone);
  return parts.hour * 60 + parts.minute;
}

function readDate(value) {
  if (!value) return null;
  if (typeof value === 'string') return new Date(value);
  if (value.dateTime) return new Date(value.dateTime);
  if (value.start?.dateTime) return new Date(value.start.dateTime);
  return null;
}

const busy = [];
for (const row of busyRaw) {
  const rows = Array.isArray(row.bookedSlots) ? row.bookedSlots : Array.isArray(row.busy) ? row.busy : [row];
  for (const slot of rows) {
    const start = readDate(slot.start ?? slot);
    const end = readDate(slot.end ?? slot);
    if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) busy.push({ start, end });
  }
}

function overlaps(start, end) {
  return busy.some((slot) => start < slot.end && end > slot.start);
}

const requestedAvailable = Boolean(requested.available) && Boolean(request.requestedWithinBusinessHours);
const alternativeTimes = [];
let cursor = zonedWallTimeToUtc(request.date, '00:00', request.timezone);
const dayEnd = new Date(request.clientDayEndUtc);
while (cursor < dayEnd && alternativeTimes.length < request.maxAlternatives) {
  const end = new Date(cursor.getTime() + request.slotMinutes * 60000);
  const startBusiness = businessMinutes(cursor);
  const endBusiness = businessMinutes(new Date(end.getTime() - 1));
  if (cursor.getTime() > Date.now()
    && clientDate(cursor) === request.date
    && startBusiness >= request.businessStartMinute
    && endBusiness <= request.businessEndMinute
    && !overlaps(cursor, end)) {
    const label = clientTime(cursor);
    if (!alternativeTimes.includes(label) && cursor.toISOString() !== request.requestedStartUtc) alternativeTimes.push(label);
  }
  cursor = new Date(cursor.getTime() + request.stepMinutes * 60000);
}

return [{ json: {
  success: true,
  available: requestedAvailable,
  requestedDate: request.date,
  requestedTime: request.time,
  clientTimezone: request.timezone,
  requestedTimeIST: request.requestedTimeIST,
  alternatives: requestedAvailable ? [] : alternativeTimes,
  message: requestedAvailable ? 'Your requested time is available.' : 'That time is not available. Please choose one of the returned alternatives.',
} }];
`,
    },
  },
  output: [{ success: true, available: true, alternatives: [] }],
});

const respondAvailability = node({
  type: "n8n-nodes-base.respondToWebhook",
  version: 1.5,
  config: {
    name: "Respond Availability Result",
    parameters: {
      respondWith: "json",
      responseBody: expr("{{ $json }}"),
      options: { responseCode: 200 },
    },
  },
});

const note = sticky("## Availability Check\nSeparate webhook for availability only. It validates timezone-aware input, checks the FlowNex calendar, and returns real same-client-date alternatives without writing Sheets or creating meetings.", [validateAvailabilityPayload, checkRequestedCalendar, fetchBusySlots, buildAvailabilityResponse], { color: 4 });

export default workflow("flownex-availability-check", "FlowNex - Availability Check")
  .add(availabilityWebhook)
  .to(validateAvailabilityPayload)
  .to(payloadValid
    .onTrue(checkRequestedCalendar.to(fetchBusySlots).to(buildAvailabilityResponse).to(respondAvailability))
    .onFalse(respondAvailabilityValidation))
  .add(note)
  .group("Calendar availability", [checkRequestedCalendar, fetchBusySlots, buildAvailabilityResponse, respondAvailability], {
    description: "Checks the requested slot and builds real alternatives.",
  });
