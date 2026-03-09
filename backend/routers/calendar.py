from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from googleapiclient.discovery import build

from google_auth import ensure_google_creds

router = APIRouter(prefix="/google/calendar", tags=["calendar"])


def _get_calendar_service():
    creds = ensure_google_creds()
    return build("calendar", "v3", credentials=creds)


@router.get("/events")
async def get_events(days: int = 7, max_results: int = 20):
    """Fetch upcoming calendar events."""
    try:
        service = _get_calendar_service()
        now = datetime.utcnow().isoformat() + "Z"
        end = (datetime.utcnow() + timedelta(days=days)).isoformat() + "Z"

        result = service.events().list(
            calendarId="primary",
            timeMin=now,
            timeMax=end,
            maxResults=max_results,
            singleEvents=True,
            orderBy="startTime",
        ).execute()

        events = []
        for event in result.get("items", []):
            start = event.get("start", {}).get("dateTime", event.get("start", {}).get("date", ""))
            end_time = event.get("end", {}).get("dateTime", event.get("end", {}).get("date", ""))
            events.append({
                "id": event.get("id"),
                "summary": event.get("summary", "No title"),
                "start": start,
                "end": end_time,
                "location": event.get("location", ""),
                "description": event.get("description", ""),
            })

        return {"events": events}
    except FileNotFoundError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calendar error: {e}")


class CreateEventRequest(BaseModel):
    summary: str
    start: str  # ISO format datetime
    end: str
    description: str = ""
    location: str = ""


@router.post("/events")
async def create_event(req: CreateEventRequest):
    """Create a new calendar event."""
    try:
        service = _get_calendar_service()
        event_body = {
            "summary": req.summary,
            "location": req.location,
            "description": req.description,
            "start": {"dateTime": req.start, "timeZone": "Asia/Kolkata"},
            "end": {"dateTime": req.end, "timeZone": "Asia/Kolkata"},
        }

        event = service.events().insert(calendarId="primary", body=event_body).execute()
        return {"status": "created", "id": event.get("id"), "link": event.get("htmlLink")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calendar create error: {e}")
