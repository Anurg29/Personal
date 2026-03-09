import base64
from email.mime.text import MIMEText

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from googleapiclient.discovery import build

from google_auth import ensure_google_creds

router = APIRouter(prefix="/google/gmail", tags=["gmail"])


def _get_gmail_service():
    creds = ensure_google_creds()
    return build("gmail", "v1", credentials=creds)


@router.get("/inbox")
async def get_inbox(max_results: int = 10):
    """Fetch recent emails from inbox."""
    try:
        service = _get_gmail_service()
        results = service.users().messages().list(
            userId="me", maxResults=max_results, labelIds=["INBOX"]
        ).execute()

        messages = results.get("messages", [])
        emails = []
        for msg in messages:
            detail = service.users().messages().get(
                userId="me", id=msg["id"], format="metadata",
                metadataHeaders=["From", "Subject", "Date"],
            ).execute()

            headers = {h["name"]: h["value"] for h in detail.get("payload", {}).get("headers", [])}
            emails.append({
                "id": msg["id"],
                "from": headers.get("From", ""),
                "subject": headers.get("Subject", ""),
                "date": headers.get("Date", ""),
                "snippet": detail.get("snippet", ""),
            })

        return {"emails": emails, "total": results.get("resultSizeEstimate", 0)}
    except FileNotFoundError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gmail error: {e}")


@router.get("/message/{message_id}")
async def get_message(message_id: str):
    """Get full email content."""
    try:
        service = _get_gmail_service()
        msg = service.users().messages().get(userId="me", id=message_id, format="full").execute()

        headers = {h["name"]: h["value"] for h in msg.get("payload", {}).get("headers", [])}
        body = ""
        payload = msg.get("payload", {})

        if payload.get("body", {}).get("data"):
            body = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
        elif payload.get("parts"):
            for part in payload["parts"]:
                if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
                    body = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
                    break

        return {
            "id": message_id,
            "from": headers.get("From", ""),
            "to": headers.get("To", ""),
            "subject": headers.get("Subject", ""),
            "date": headers.get("Date", ""),
            "body": body,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gmail error: {e}")


class SendEmailRequest(BaseModel):
    to: str
    subject: str
    body: str


@router.post("/send")
async def send_email(req: SendEmailRequest):
    """Send an email."""
    try:
        service = _get_gmail_service()
        message = MIMEText(req.body)
        message["to"] = req.to
        message["subject"] = req.subject
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

        result = service.users().messages().send(
            userId="me", body={"raw": raw}
        ).execute()

        return {"status": "sent", "id": result.get("id")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gmail send error: {e}")
