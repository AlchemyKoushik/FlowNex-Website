# FlowNex Backend Contract

This document covers only the backend/API/n8n/Google integration surface. AntiGravity owns the frontend experience.

## Public API

### `POST /api/availability`

Content type: `application/json`

Request body:

```json
{
  "date": "2026-09-15",
  "time": "18:30",
  "timezone": "America/New_York"
}
```

The backend validates the date, time, timezone, and future-slot requirement, then dispatches to the n8n availability workflow.

Success response:

```json
{
  "success": true,
  "available": true,
  "requested": {
    "startUtc": "2026-09-15T22:30:00.000Z",
    "endUtc": "2026-09-15T23:30:00.000Z",
    "startIST": "2026-09-16T04:00:00+05:30",
    "endIST": "2026-09-16T05:00:00+05:30"
  },
  "alternatives": []
}
```

If the slot is occupied, n8n returns HTTP `200` with `available: false` and suggested alternatives. Validation errors return HTTP `400`.

### `POST /api/meeting-request`

Content type: `multipart/form-data`

Fields:

| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | 2-120 characters |
| `email` | Yes | Lower-cased server-side |
| `preferredDate` | Yes | `YYYY-MM-DD` |
| `preferredTime` | Yes | `HH:mm`, 24-hour |
| `timezone` | Yes | IANA timezone |
| `problem` | Conditional | Required only when no audio is attached; max 4000 characters |
| `voiceRecording` | Conditional | Required only when `problem` is empty; `audio/webm`, `audio/ogg`, `audio/mpeg`, `audio/mp4`, or `audio/wav`; max 15 MB |
| `idempotencyKey` | No | Optional caller-supplied dedupe key; otherwise server derives one |

The final submission can be text only, audio only, or text plus audio. The system does not transcribe audio and does not use Whisper/OpenAI for the audio path.

Success response:

```json
{
  "success": true,
  "leadId": "FN-2026-000001",
  "status": "INVITE_PENDING",
  "processingStatus": "PROCESSING",
  "meetingStatus": "INVITE_PENDING",
  "invitationStatus": "PENDING",
  "message": "Request received and queued for scheduling.",
  "duplicate": false
}
```

If n8n is not configured, the API persists the intake locally and returns HTTP `202` with `CONFIGURATION_REQUIRED`.

## Timezone Handling

The frontend sends a client wall-clock date/time and IANA timezone. The backend and n8n resolve that exact instant to UTC and `Asia/Kolkata`.

Defaults:

- Team timezone: `Asia/Kolkata`
- Slot length: 60 minutes
- Alternative slot step: 30 minutes
- Business hours: 10:00-19:00 IST
- Alternative suggestions: up to 5

## Audio

The backend validates MIME type and size before saving the original recording under `.data/flownex/voice-recordings`, which is ignored by Git. n8n receives the multipart binary and uploads the original recording to Google Drive when present.

The protected local retrieval endpoint is:

`GET /api/lead-audio/:leadId`

Required header:

`Authorization: Bearer <FLOWNEX_INTERNAL_API_SECRET>`

## Google Resources

| Resource | Value |
| --- | --- |
| Google Sheet | `1r3dBdS3yrOraTzPaid2vYA6haiBb5eNzGvifL41t7WE` |
| Sheet tab | `Sheet1` / `gid=0` from prior lookup |
| Calendar | `koushiknox@gmail.com` |
| Drive folder | `FlowNex Solutions` / `1WScWGGYCxEUjtnCEOhXbfhHYhcYXolsZ` |

Current blocker: the n8n Google Sheets credential exists but reports that it needs to be reconnected, so Sheet lookup/write could not be live-verified.

## Google Sheets Columns

n8n uses Google Sheets `appendOrUpdate` with matching column `Lead ID`, value input mode `USER_ENTERED`.

Headers:

`Lead ID`, `Name`, `Email`, `Preferred Date`, `Preferred Time`, `Client Timezone`, `Timezone`, `Requested Time IST`, `Problem`, `Voice Recs`, `Voice File Link`, `Meeting Status`, `Meeting Link`, `Calendar Event ID`, `Meeting ID`, `Meeting Start`, `Meeting End`, `Meeting Acceptance Status`, `Invitation Status`, `Overall Lead Status`, `Last Error`, `Retry Count`, `Created At`, `Updated At`

`Voice Recs` is written as a Sheets hyperlink formula when Drive returns a file URL. No transcript column is required for the new flow.

## Live n8n Workflows

Created in the personal n8n project `Koushik Bhandary <koushiknox@gmail.com>` on 2026-09-03:

| Workflow | n8n ID | Status | Trigger |
| --- | --- | --- | --- |
| `FlowNex - Availability Check` | `8M68bqaHfASmyOdb` | Inactive draft | `POST https://n8n.alchemy-research.com/webhook/flownex/availability` |
| `FlowNex - Meeting Request` | `7jGqZ3GjJh2SqOI7` | Inactive draft | `POST https://n8n.alchemy-research.com/webhook/flownex/meeting-request` |

Existing support drafts left inactive:

| Workflow | n8n ID | Status |
| --- | --- | --- |
| `FlowNex - Meeting Status` | `nzgu2yHuqtFdsozp` | Inactive draft |
| `FlowNex - Error & Retry Handling` | `VFx8CPHjflr7bZld` | Inactive draft |

Archived old conflicting drafts:

- `FlowNex - Lead Intake` / `jLCZJV7C9mLu3UzQ`
- `FlowNex - Voice Processing` / `vi2c7kCElUukqLgo`
- `FlowNex - Meeting Scheduling` / `pZRkoe8cdYndLptA`

## Environment Variables

| Variable | Required For | Notes |
| --- | --- | --- |
| `FLOWNEX_N8N_AVAILABILITY_URL` | Availability checks | Production webhook URL after workflow publish |
| `FLOWNEX_N8N_MEETING_REQUEST_URL` | Final meeting submissions | Production webhook URL after workflow publish |
| `FLOWNEX_N8N_WEBHOOK_SECRET` | Backend to n8n verification | Sent as `x-flownex-webhook-secret`; n8n auth still needs final binding |
| `FLOWNEX_INTERNAL_API_SECRET` | Protected audio retrieval | Bearer token for `/api/lead-audio/:leadId` |
| `FLOWNEX_PUBLIC_BASE_URL` | Public audio URL construction | Public website origin for n8n |

## Error Codes

Common API errors: `validation_error`, `unsupported_media_type`, `payload_too_large`, `configuration_required`, `slot_unavailable`, `duplicate_conflict`, `upstream_timeout`, `service_unavailable`, and `internal_error`.

## Current Blockers

1. Reconnect the Google Sheets credential in n8n.
2. Create or bind a FlowNex-specific inbound webhook authentication pattern before publishing.
3. Run controlled live side-effect testing for Sheet write, Drive upload/link permission, Calendar/Meet creation, and invite delivery.
