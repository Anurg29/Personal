from fastapi import APIRouter, HTTPException
from googleapiclient.discovery import build

from google_auth import ensure_google_creds

router = APIRouter(prefix="/google/drive", tags=["drive"])


def _get_drive_service():
    creds = ensure_google_creds()
    return build("drive", "v3", credentials=creds)


@router.get("/files")
async def list_files(max_results: int = 20, query: str = ""):
    """List recent files from Google Drive."""
    try:
        service = _get_drive_service()
        q = query if query else None
        results = service.files().list(
            pageSize=max_results,
            fields="files(id, name, mimeType, modifiedTime, size, webViewLink, iconLink)",
            orderBy="modifiedTime desc",
            q=q,
        ).execute()

        files = []
        for f in results.get("files", []):
            files.append({
                "id": f.get("id"),
                "name": f.get("name"),
                "mimeType": f.get("mimeType"),
                "modifiedTime": f.get("modifiedTime"),
                "size": f.get("size"),
                "webViewLink": f.get("webViewLink"),
                "iconLink": f.get("iconLink"),
            })

        return {"files": files}
    except FileNotFoundError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Drive error: {e}")


@router.get("/search")
async def search_files(query: str, max_results: int = 10):
    """Search files in Google Drive."""
    try:
        service = _get_drive_service()
        results = service.files().list(
            pageSize=max_results,
            fields="files(id, name, mimeType, modifiedTime, webViewLink)",
            q=f"name contains '{query}'",
            orderBy="modifiedTime desc",
        ).execute()

        return {"files": results.get("files", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Drive search error: {e}")
