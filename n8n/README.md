# FlowNex n8n Automation

This folder documents the FlowNex automation layer owned by backend/API/n8n. The frontend is out of scope.

## Workflows

Live n8n drafts created on 2026-09-03:

| Workflow | n8n ID | URL | Status |
| --- | --- | --- | --- |
| `FlowNex - Availability Check` | `8M68bqaHfASmyOdb` | https://n8n.alchemy-research.com/workflow/8M68bqaHfASmyOdb | Inactive draft |
| `FlowNex - Meeting Request` | `7jGqZ3GjJh2SqOI7` | https://n8n.alchemy-research.com/workflow/7jGqZ3GjJh2SqOI7 | Inactive draft |

Webhook trigger paths:

- Availability: `POST https://n8n.alchemy-research.com/webhook/flownex/availability`
- Meeting request: `POST https://n8n.alchemy-research.com/webhook/flownex/meeting-request`

The production webhook URLs execute only after the workflows are published. Test URLs use `/webhook-test/...`.

Existing support drafts left inactive:

| Workflow | n8n ID | URL |
| --- | --- | --- |
| `FlowNex - Meeting Status` | `nzgu2yHuqtFdsozp` | https://n8n.alchemy-research.com/workflow/nzgu2yHuqtFdsozp |
| `FlowNex - Error & Retry Handling` | `VFx8CPHjflr7bZld` | https://n8n.alchemy-research.com/workflow/VFx8CPHjflr7bZld |

Archived old conflicting drafts:

- `FlowNex - Lead Intake` / `jLCZJV7C9mLu3UzQ`
- `FlowNex - Voice Processing` / `vi2c7kCElUukqLgo`
- `FlowNex - Meeting Scheduling` / `pZRkoe8cdYndLptA`

## Confirmed Resources

- Google Sheet: `1r3dBdS3yrOraTzPaid2vYA6haiBb5eNzGvifL41t7WE`
- Sheet tab: `Sheet1` / `gid=0` from prior lookup
- Google Drive folder: `FlowNex Solutions` / `1WScWGGYCxEUjtnCEOhXbfhHYhcYXolsZ`
- Google Calendar: `koushiknox@gmail.com`
- Timezone: `Asia/Kolkata`

## Required Credentials

- Google Calendar credential: connected and bound.
- Google Drive credential: connected and bound.
- Google Sheets credential: exists, but n8n reports that it needs to be reconnected.
- FlowNex inbound webhook authentication: still needs final binding before publish.

No OpenAI, Whisper, or transcription credential is used by the new audio path.

## Flow

1. Availability workflow validates a requested client date/time/timezone, checks the calendar, and returns whether the slot is open plus alternatives.
2. Meeting-request workflow accepts the final form submission, preserves text and/or original audio, rechecks calendar availability, uploads audio to Drive when attached, upserts the lead row, creates a Google Calendar event with Meet, and updates the row with scheduling details.

## Idempotency

`Lead ID` is the correlation key across the backend, n8n, Google Sheets, Google Drive, and Google Calendar. The meeting workflow checks existing Sheet rows before scheduling and uses a deterministic Calendar event ID derived from `Lead ID` to reduce duplicate event creation.

## Error Handling

The two new workflows currently remain inactive drafts because the Sheet credential and webhook-auth pieces are not production-ready. The existing support error workflow is still inactive. Before publishing, choose whether failures should be handled by a shared Error Trigger workflow or by same-workflow failure branches, then run controlled live tests.

## Status Vocabulary

Primary statuses used by the new flow include `RECEIVED`, `INVITE_PENDING`, `INVITE_SENT`, `SLOT_UNAVAILABLE`, `DUPLICATE`, `CONFIRMED`, `DECLINED`, `TENTATIVE`, `RETRY_PENDING`, and `AUTOMATION_ERROR`.
