import httpx
from fastapi import APIRouter, HTTPException

from config import GITHUB_TOKEN, GITHUB_USERNAME

router = APIRouter(tags=["github"])

GITHUB_API = "https://api.github.com"


@router.get("/github")
async def get_github_data():
    if not GITHUB_TOKEN or not GITHUB_USERNAME:
        raise HTTPException(status_code=500, detail="GitHub credentials not configured")

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }

    async with httpx.AsyncClient() as client:
        profile_res, repos_res, events_res = await _fetch_parallel(client, headers)

    if profile_res.status_code != 200 or repos_res.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch GitHub data")

    return {
        "profile": profile_res.json(),
        "repos": repos_res.json(),
        "events": events_res.json() if events_res.status_code == 200 else [],
    }

async def _fetch_parallel(client: httpx.AsyncClient, headers: dict):
    import asyncio

    profile_task = client.get(
        f"{GITHUB_API}/users/{GITHUB_USERNAME}",
        headers=headers,
        timeout=10.0,
    )
    repos_task = client.get(
        f"{GITHUB_API}/users/{GITHUB_USERNAME}/repos",
        params={"sort": "updated", "direction": "desc", "per_page": 5},
        headers=headers,
        timeout=10.0,
    )
    events_task = client.get(
        f"{GITHUB_API}/users/{GITHUB_USERNAME}/events",
        params={"per_page": 10},
        headers=headers,
        timeout=10.0,
    )
    return await asyncio.gather(profile_task, repos_task, events_task)
