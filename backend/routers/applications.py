from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db, JobApplication, ApplicationStatus


router = APIRouter(prefix="/applications", tags=["applications"])


class ApplicationCreateRequest(BaseModel):
    company: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)
    platform: str = Field(..., min_length=1)
    status: ApplicationStatus = ApplicationStatus.APPLIED
    location: Optional[str] = None
    salary_range: Optional[str] = None
    applied_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None
    job_url: Optional[str] = None
    contact_person: Optional[str] = None


class ApplicationUpdateRequest(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    platform: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    applied_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None
    job_url: Optional[str] = None
    contact_person: Optional[str] = None


@router.post("")
def create_application(request: ApplicationCreateRequest, db: Session = Depends(get_db)):
    """Create a new job application entry"""
    application = JobApplication(
        company=request.company.strip(),
        role=request.role.strip(),
        platform=request.platform.strip(),
        status=request.status,
        location=request.location.strip() if request.location else None,
        salary_range=request.salary_range.strip() if request.salary_range else None,
        applied_date=request.applied_date or datetime.utcnow(),
        follow_up_date=request.follow_up_date,
        notes=request.notes.strip() if request.notes else None,
        job_url=request.job_url.strip() if request.job_url else None,
        contact_person=request.contact_person.strip() if request.contact_person else None,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "data": _application_to_dict(application),
        "message": "Application tracked successfully"
    }


@router.get("")
def list_applications(
    status: Optional[ApplicationStatus] = Query(default=None),
    platform: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    """List tracked applications with optional filters"""
    query = db.query(JobApplication)

    if status:
        query = query.filter(JobApplication.status == status)

    if platform and platform.strip():
        query = query.filter(JobApplication.platform.ilike(platform.strip()))

    if search and search.strip():
        q = f"%{search.strip()}%"
        query = query.filter(
            (JobApplication.company.ilike(q))
            | (JobApplication.role.ilike(q))
            | (JobApplication.platform.ilike(q))
        )

    applications = query.order_by(JobApplication.applied_date.desc(), JobApplication.created_at.desc()).all()

    return {
        "success": True,
        "data": [_application_to_dict(app) for app in applications]
    }


@router.get("/stats")
def get_application_stats(db: Session = Depends(get_db)):
    """Get analytics for all tracked applications"""
    applications: List[JobApplication] = db.query(JobApplication).all()

    total = len(applications)
    if total == 0:
        return {
            "success": True,
            "data": {
                "total_applications": 0,
                "active_pipeline": 0,
                "offers": 0,
                "rejections": 0,
                "response_rate_percent": 0.0,
                "offer_rate_percent": 0.0,
                "status_breakdown": [],
                "platform_breakdown": [],
                "recent_30_days": 0,
                "upcoming_followups": 0,
            },
        }

    status_counts = {}
    platform_counts = {}

    offers = 0
    rejections = 0
    responses = 0
    active_pipeline = 0
    recent_30_days = 0
    upcoming_followups = 0

    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    seven_days_later = datetime.utcnow() + timedelta(days=7)

    for app in applications:
        status_key = app.status.value
        platform_key = app.platform

        status_counts[status_key] = status_counts.get(status_key, 0) + 1
        platform_counts[platform_key] = platform_counts.get(platform_key, 0) + 1

        if app.status == ApplicationStatus.OFFER:
            offers += 1
            responses += 1
        elif app.status == ApplicationStatus.REJECTED:
            rejections += 1
            responses += 1
        elif app.status in [ApplicationStatus.ASSESSMENT, ApplicationStatus.INTERVIEW]:
            responses += 1

        if app.status in [ApplicationStatus.APPLIED, ApplicationStatus.ASSESSMENT, ApplicationStatus.INTERVIEW]:
            active_pipeline += 1

        if app.applied_date and app.applied_date >= thirty_days_ago:
            recent_30_days += 1

        if app.follow_up_date and datetime.utcnow() <= app.follow_up_date <= seven_days_later:
            upcoming_followups += 1

    response_rate = (responses / total) * 100 if total > 0 else 0.0
    offer_rate = (offers / total) * 100 if total > 0 else 0.0

    status_breakdown = [
        {"status": key, "count": value, "percent": round((value / total) * 100, 2)}
        for key, value in status_counts.items()
    ]

    platform_breakdown = [
        {"platform": key, "count": value, "percent": round((value / total) * 100, 2)}
        for key, value in platform_counts.items()
    ]

    status_breakdown.sort(key=lambda x: x["count"], reverse=True)
    platform_breakdown.sort(key=lambda x: x["count"], reverse=True)

    return {
        "success": True,
        "data": {
            "total_applications": total,
            "active_pipeline": active_pipeline,
            "offers": offers,
            "rejections": rejections,
            "response_rate_percent": round(response_rate, 2),
            "offer_rate_percent": round(offer_rate, 2),
            "status_breakdown": status_breakdown,
            "platform_breakdown": platform_breakdown,
            "recent_30_days": recent_30_days,
            "upcoming_followups": upcoming_followups,
        },
    }


@router.patch("/{application_id}")
def update_application(application_id: int, request: ApplicationUpdateRequest, db: Session = Depends(get_db)):
    """Update a tracked application"""
    app = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(app, field, value)

    db.commit()
    db.refresh(app)

    return {
        "success": True,
        "data": _application_to_dict(app),
        "message": "Application updated successfully"
    }


@router.delete("/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    """Delete a tracked application"""
    app = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(app)
    db.commit()

    return {
        "success": True,
        "message": "Application removed successfully"
    }


def _application_to_dict(application: JobApplication):
    return {
        "id": application.id,
        "company": application.company,
        "role": application.role,
        "platform": application.platform,
        "status": application.status.value,
        "location": application.location,
        "salary_range": application.salary_range,
        "applied_date": application.applied_date.isoformat() if application.applied_date else None,
        "follow_up_date": application.follow_up_date.isoformat() if application.follow_up_date else None,
        "notes": application.notes,
        "job_url": application.job_url,
        "contact_person": application.contact_person,
        "created_at": application.created_at.isoformat() if application.created_at else None,
        "updated_at": application.updated_at.isoformat() if application.updated_at else None,
    }
