from datetime import datetime, timedelta

from langchain_core.tools import tool
from googleapiclient.discovery import build

from google_auth import get_google_creds


def _calendar_service():
    creds = get_google_creds()
    if not creds or not creds.valid:
        return None
    return build("calendar", "v3", credentials=creds)


@tool
def get_upcoming_events(days: int = 7) -> str:
    """Get upcoming calendar events for the next N days. Default is 7 days."""
    service = _calendar_service()
    if not service:
        return "Google account not connected. Please connect via Settings."

    now = datetime.utcnow().isoformat() + "Z"
    end = (datetime.utcnow() + timedelta(days=days)).isoformat() + "Z"

    result = service.events().list(
        calendarId="primary",
        timeMin=now,
        timeMax=end,
        maxResults=20,
        singleEvents=True,
        orderBy="startTime",
    ).execute()

    events = result.get("items", [])
    if not events:
        return f"No events found in the next {days} days."

    output = []
    for event in events:
        start = event.get("start", {}).get("dateTime", event.get("start", {}).get("date", ""))
        output.append(
            f"Event: {event.get('summary', 'No title')}\n"
            f"When: {start}\n"
            f"Where: {event.get('location', 'No location')}"
        )

    return "\n---\n".join(output)


@tool
def create_calendar_event(summary: str, start_time: str, end_time: str, description: str = "", location: str = "") -> str:
    """Create a new Google Calendar event. Times should be in ISO format like '2025-03-15T10:00:00'."""
    service = _calendar_service()
    if not service:
        return "Google account not connected. Please connect via Settings."

    event_body = {
        "summary": summary,
        "location": location,
        "description": description,
        "start": {"dateTime": start_time, "timeZone": "Asia/Kolkata"},
        "end": {"dateTime": end_time, "timeZone": "Asia/Kolkata"},
    }

    event = service.events().insert(calendarId="primary", body=event_body).execute()
    return f"Event '{summary}' created successfully. Link: {event.get('htmlLink')}"
