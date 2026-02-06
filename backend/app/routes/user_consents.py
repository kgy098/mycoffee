"""User consent routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from datetime import datetime
from typing import List

from app.database import get_db
from app.models import UserConsent
from pydantic import BaseModel

router = APIRouter()


class ConsentUpdateRequest(BaseModel):
    user_id: int
    consent_type: str
    is_agreed: bool


class ConsentResponse(BaseModel):
    user_id: int
    consent_type: str
    is_agreed: bool
    agreed_at: datetime | None = None

    class Config:
        from_attributes = True


@router.get("/user-consents", response_model=List[ConsentResponse])
async def list_user_consents(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    return (
        db.query(UserConsent)
        .filter(UserConsent.user_id == user_id)
        .all()
    )


@router.put("/user-consents", response_model=ConsentResponse)
async def upsert_user_consent(
    payload: ConsentUpdateRequest,
    db: Session = Depends(get_db)
):
    consent = (
        db.query(UserConsent)
        .filter(
            UserConsent.user_id == payload.user_id,
            UserConsent.consent_type == payload.consent_type,
        )
        .first()
    )

    if consent:
        consent.is_agreed = payload.is_agreed
        consent.agreed_at = datetime.utcnow()
        db.commit()
        db.refresh(consent)
        return consent

    consent = UserConsent(
        user_id=payload.user_id,
        consent_type=payload.consent_type,
        is_agreed=payload.is_agreed,
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return consent
