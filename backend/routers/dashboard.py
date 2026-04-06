from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, UrgentTask, StrategicGoal
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/")
def get_dashboard_data(db: Session = Depends(get_db)):
    tasks = db.query(UrgentTask).order_by(UrgentTask.created_at.desc()).limit(5).all()
    goals = db.query(StrategicGoal).order_by(StrategicGoal.created_at.desc()).limit(5).all()
    
    # If db is empty, return initial mock data for UX
    if not tasks and not goals:
        return {
            "tasks": [
                {"id": 1, "title": "VFX Sequences - Final Render", "description": "DUE: April 6th • Review with Client", "status": "urgent"},
                {"id": 2, "title": "Q3 Strategic Briefing Deck", "description": "DUE: April 8th • Requires input", "status": "pending"}
            ],
            "strategies": [
                {"label": "PROJECT NEBULA", "status": "85%", "color": "#00d4ff", "text": "Alpha Release"},
                {"label": "CLIENT ACQUISITION", "status": "+12%", "color": "#00ff9d", "text": "M/M Growth"},
                {"label": "SERVER MIGRATION", "status": "HOLD", "color": "#ffb300", "text": "Awaiting AWS"}
            ]
        }

    return {
        "tasks": [{"id": t.id, "title": t.title, "description": t.description, "status": t.status} for t in tasks],
        "strategies": [{"label": g.name, "status": g.status_text, "color": g.color, "text": g.subtitle} for g in goals]
    }
