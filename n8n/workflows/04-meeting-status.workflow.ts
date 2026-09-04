import { workflow, node, trigger, sticky, newCredential, expr } from "@n8n/workflow-sdk";

const statusSchedule = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: {
    name: "Every 30 Minutes",
    position: [240, 300],
    parameters: {
      rule: { interval: [{ field: "minutes", minutesInterval: 30 }] },
    },
  },
  output: [{}],
});

const fetchPendingInvites = node({
  type: "n8n-nodes-base.googleSheets",
  version: 4.7,
  config: {
    name: "Read Pending Invite Rows",
    position: [560, 300],
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "sheet",
      operation: "read",
      authentication: "oAuth2",
      documentId: { __rl: true, mode: "id", value: "", cachedResultName: "FlowNex Leads" },
      sheetName: { __rl: true, mode: "name", value: "Leads" },
      options: {},
    },
    credentials: { googleSheetsOAuth2Api: newCredential("FlowNex Google Sheets") },
  },
  output: [{ "Lead ID": "FN-2026-000001", "Calendar Event ID": "calendar-event-id", "Invitation Status": "INVITE_SENT" }],
});

const pendingOnly = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Filter Pending Responses",
    position: [880, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "return $input.all()\n" +
        "  .filter((item) => item.json['Calendar Event ID'] && item.json['Invitation Status'] === 'INVITE_SENT')\n" +
        "  .map((item) => ({ json: item.json }));",
    },
  },
  output: [{ "Lead ID": "FN-2026-000001", "Calendar Event ID": "calendar-event-id" }],
});

const getEvent = node({
  type: "n8n-nodes-base.googleCalendar",
  version: 1.3,
  config: {
    name: "Get Calendar Event",
    position: [1200, 300],
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 5000,
    parameters: {
      resource: "event",
      operation: "get",
      calendar: { __rl: true, mode: "id", value: "", cachedResultName: "FlowNex Booking Calendar" },
      eventId: expr("{{ $json['Calendar Event ID'] }}"),
      options: {},
    },
    credentials: { googleCalendarOAuth2Api: newCredential("FlowNex Google Calendar") },
  },
  output: [{ id: "calendar-event-id", attendees: [{ email: "jane@company.com", responseStatus: "accepted" }] }],
});

const deriveInviteStatus = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Derive Invite Status",
    position: [1520, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "return $input.all().map((item) => {\n" +
        "  const attendee = (item.json.attendees || []).find((a) => ['accepted', 'declined'].includes(a.responseStatus));\n" +
        "  const status = attendee?.responseStatus === 'accepted' ? 'ACCEPTED' : attendee?.responseStatus === 'declined' ? 'DECLINED' : 'INVITE_SENT';\n" +
        "  return { json: { ...item.json, invitationStatus: status, meetingStatus: status, acceptedAt: status === 'ACCEPTED' ? new Date().toISOString() : '' } };\n" +
        "});",
    },
  },
  output: [{ id: "calendar-event-id", invitationStatus: "ACCEPTED", meetingStatus: "ACCEPTED" }],
});

const note = sticky("Acceptance is derived from attendee responseStatus only. Event creation alone must never mark ACCEPTED.", [getEvent, deriveInviteStatus], { color: 3 });

export default workflow("flownex-04-meeting-status", "FlowNex 04 - Meeting Status")
  .add(statusSchedule)
  .to(fetchPendingInvites)
  .to(pendingOnly)
  .to(getEvent)
  .to(deriveInviteStatus)
  .add(note)
  .group("Response polling", [fetchPendingInvites, pendingOnly, getEvent, deriveInviteStatus], {
    description: "Polls invite responses and emits deterministic acceptance state.",
  });
