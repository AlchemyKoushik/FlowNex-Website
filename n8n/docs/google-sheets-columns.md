# Google Sheets Columns

Use spreadsheet ID `1r3dBdS3yrOraTzPaid2vYA6haiBb5eNzGvifL41t7WE`.

The target tab is `Sheet1` with `gid=0` from prior lookup. Current live n8n lookup is blocked because the Google Sheets credential needs to be reconnected.

Create or preserve this header row:

| Header | Source |
| --- | --- |
| Lead ID | Backend-generated `leadId` |
| Name | Final form submission |
| Email | Final form submission, lower-cased server-side |
| Preferred Date | Final form submission |
| Preferred Time | Final form submission |
| Client Timezone | Final form IANA timezone |
| Timezone | Team timezone, `Asia/Kolkata` |
| Requested Time IST | Requested start converted to IST |
| Problem | Final form text, blank allowed when audio exists |
| Voice Recs | Sheets hyperlink formula to the Drive recording when audio exists |
| Voice File Link | Raw Drive file URL when audio exists |
| Meeting Status | Scheduling lifecycle status |
| Meeting Link | Google Meet link |
| Calendar Event ID | Google Calendar event ID |
| Meeting ID | Same as Calendar event ID unless a separate external ID is introduced |
| Meeting Start | Scheduled start datetime |
| Meeting End | Scheduled end datetime |
| Meeting Acceptance Status | Calendar attendee response status |
| Invitation Status | Invite delivery status |
| Overall Lead Status | Operational lifecycle status |
| Last Error | Sanitized last automation error |
| Retry Count | Bounded retry counter |
| Created At | Backend or workflow receive time |
| Updated At | Workflow update time |

Use Google Sheets `appendOrUpdate` with matching column `Lead ID` and value input mode `USER_ENTERED`. Do not append duplicate rows.

The new flow preserves original audio only. It does not create or require an audio transcript.
