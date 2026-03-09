from fastapi import APIRouter, HTTPException
from google_auth import get_google_creds, run_oauth_flow, TOKEN_PATH

router = APIRouter(prefix="/google", tags=["google-auth"])


@router.get("/status")
async def google_auth_status():
    """Check if Google OAuth is active."""
    creds = get_google_creds()
    if creds and creds.valid:
        return {"authenticated": True}
    return {"authenticated": False}


@router.post("/connect")
async def google_connect():
    """Trigger the Google OAuth2 consent flow."""
    try:
        creds = run_oauth_flow()
        return {"authenticated": True, "message": "Google account connected successfully"}
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth error: {e}")


@router.post("/disconnect")
async def google_disconnect():
    """Remove stored Google credentials."""
    if TOKEN_PATH.exists():
        TOKEN_PATH.unlink()
    return {"authenticated": False, "message": "Google account disconnected"}
