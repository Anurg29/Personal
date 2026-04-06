from datetime import datetime, timedelta
from fastapi import APIRouter
import json

try:
    from routers.calendar import _get_calendar_service
    from routers.gmail import _get_gmail_service
except ImportError:
    pass

router = APIRouter(prefix="/briefing", tags=["briefing"])

@router.get("/")
async def get_daily_briefing():
    """Fetch aggregated daily briefing: Calendar + Gmail."""
    try:
        # Attempt to get real data
        cal_svc = _get_calendar_service()
        gmail_svc = _get_gmail_service()
        
        # Calendar (Next 24h)
        now = datetime.utcnow().isoformat() + "Z"
        tmr = (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z"
        events_result = cal_svc.events().list(
            calendarId="primary", timeMin=now, timeMax=tmr,
            maxResults=3, singleEvents=True, orderBy="startTime"
        ).execute()
        events = events_result.get("items", [])
        
        # Gmail (Unread in Inbox)
        gmail_result = gmail_svc.users().messages().list(
            userId="me", maxResults=5, q="is:unread in:inbox"
        ).execute()
        unread_count = gmail_result.get("resultSizeEstimate", 0)
        
        event_spoken = []
        if events:
            first_event = events[0]
            summary = first_event.get("summary", "a meeting")
            event_spoken.append(f"Your next meeting is '{summary}'.")
        else:
            event_spoken.append("You have no meetings scheduled for today.")
            
        email_spoken = f"You have {unread_count} unread emails in your inbox." if unread_count > 0 else "Your inbox is completely clear."

        return {
            "status": "success",
            "is_mock": False,
            "tasks": [
                email_spoken,
                event_spoken[0],
                "Shall we begin?"
            ]
        }

    except Exception:
        # Fallback to an awesome personalized mock if google auth isn't setup yet
        return {
            "status": "success",
            "is_mock": True,
            "tasks": [
                "You have 3 unread emails, including one urgent change request from the client regarding the VFX sequence.",
                "Your first meeting is 'Strategic Alignment' at 10:30 AM.",
                "The Final Render for Project Nebula is due at 4:22 PM today.",
                "All local development servers are green. Shall we begin?"
            ]
        }
