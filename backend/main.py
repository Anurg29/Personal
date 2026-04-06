from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import FRONTEND_URL
from routers import github, chat, gmail, calendar, drive, google_auth_router, market, briefing, dashboard

app = FastAPI(title="Personal Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(github.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(google_auth_router.router, prefix="/api")
app.include_router(gmail.router, prefix="/api")
app.include_router(calendar.router, prefix="/api")
app.include_router(drive.router, prefix="/api")
app.include_router(market.router, prefix="")  # Market router already has /api prefix
app.include_router(briefing.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "online", "system": "J.A.R.V.I.S."}
