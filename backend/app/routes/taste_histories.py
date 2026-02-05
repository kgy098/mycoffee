"""Routes for analysis result (taste history + result) operations"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.schemas import TasteHistoryCreate, TasteHistoryResponse
from app.models.analysis_result import AnalysisResult

router = APIRouter()


@router.post("/", response_model=TasteHistoryResponse)
def create_taste_history(payload: TasteHistoryCreate, request: Request, db: Session = Depends(get_db)):
    """Create an analysis result record (taste history + analysis) and return it."""
    now = datetime.now(timezone.utc)
    expire_at = now + timedelta(hours=24)

    ip_address = payload.ip_address or (request.client.host if request.client else None)
    user_agent = request.headers.get("user-agent")

    analysis = AnalysisResult(
        anonymous_id=payload.anonymous_id,
        ip_address=ip_address,
        user_agent=user_agent,
        acidity=payload.acidity,
        sweetness=payload.sweetness,
        body=payload.body,
        nuttiness=payload.nuttiness,
        bitterness=payload.bitterness,
        note=payload.note,
        expire_at=expire_at,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis
