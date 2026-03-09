import os
import json
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.file",
]

TOKEN_PATH = Path(__file__).parent / "token.json"
CREDENTIALS_PATH = Path(__file__).parent / "credentials.json"


def get_google_creds() -> Credentials | None:
    """Load or refresh Google OAuth2 credentials."""
    creds = None

    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        TOKEN_PATH.write_text(creds.to_json())

    return creds


def run_oauth_flow() -> Credentials:
    """Run the interactive OAuth2 consent flow (first-time setup)."""
    if not CREDENTIALS_PATH.exists():
        raise FileNotFoundError(
            "credentials.json not found. Download it from Google Cloud Console "
            "(APIs & Services > Credentials > OAuth 2.0 Client ID > Download JSON) "
            "and place it at: " + str(CREDENTIALS_PATH)
        )

    flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_PATH), SCOPES)
    creds = flow.run_local_server(port=8090, open_browser=True)
    TOKEN_PATH.write_text(creds.to_json())
    return creds


def ensure_google_creds() -> Credentials:
    """Get valid creds or trigger OAuth flow."""
    creds = get_google_creds()
    if not creds or not creds.valid:
        creds = run_oauth_flow()
    return creds
