import base64
from email.mime.text import MIMEText

from langchain_core.tools import tool
from googleapiclient.discovery import build

from google_auth import get_google_creds


def _gmail_service():
    creds = get_google_creds()
    if not creds or not creds.valid:
        return None
    return build("gmail", "v1", credentials=creds)


@tool
def read_inbox(max_results: int = 5) -> str:
    """Read recent emails from your Gmail inbox. Returns subject, sender, and snippet for each email."""
    service = _gmail_service()
    if not service:
        return "Google account not connected. Please connect via Settings."

    results = service.users().messages().list(
        userId="me", maxResults=max_results, labelIds=["INBOX"]
    ).execute()

    messages = results.get("messages", [])
    if not messages:
        return "Your inbox is empty."

    output = []
    for msg in messages:
        detail = service.users().messages().get(
            userId="me", id=msg["id"], format="metadata",
            metadataHeaders=["From", "Subject", "Date"],
        ).execute()
        headers = {h["name"]: h["value"] for h in detail.get("payload", {}).get("headers", [])}
        output.append(
            f"From: {headers.get('From', 'Unknown')}\n"
            f"Subject: {headers.get('Subject', 'No subject')}\n"
            f"Date: {headers.get('Date', '')}\n"
            f"Preview: {detail.get('snippet', '')}\n"
        )

    return "\n---\n".join(output)


@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email via Gmail. Provide recipient email address, subject, and body text."""
    service = _gmail_service()
    if not service:
        return "Google account not connected. Please connect via Settings."

    message = MIMEText(body)
    message["to"] = to
    message["subject"] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

    result = service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return f"Email sent successfully to {to}. Message ID: {result.get('id')}"


@tool
def search_emails(query: str, max_results: int = 5) -> str:
    """Search your Gmail for emails matching a query. Use Gmail search syntax like 'from:john' or 'subject:meeting'."""
    service = _gmail_service()
    if not service:
        return "Google account not connected. Please connect via Settings."

    results = service.users().messages().list(
        userId="me", maxResults=max_results, q=query
    ).execute()

    messages = results.get("messages", [])
    if not messages:
        return f"No emails found for query: {query}"

    output = []
    for msg in messages:
        detail = service.users().messages().get(
            userId="me", id=msg["id"], format="metadata",
            metadataHeaders=["From", "Subject", "Date"],
        ).execute()
        headers = {h["name"]: h["value"] for h in detail.get("payload", {}).get("headers", [])}
        output.append(
            f"From: {headers.get('From', 'Unknown')}\n"
            f"Subject: {headers.get('Subject', 'No subject')}\n"
            f"Preview: {detail.get('snippet', '')}"
        )

    return "\n---\n".join(output)
