"""Score scales routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.score_scale import ScoreScale
from app.schemas import ScoreScaleCreate, ScoreScaleResponse

router = APIRouter()


@router.get("/", response_model=list[ScoreScaleResponse])
async def list_scales(db: Session = Depends(get_db)):
    scales = db.query(ScoreScale).order_by(ScoreScale.id).all()
    return scales


@router.post("/", response_model=ScoreScaleResponse, status_code=status.HTTP_201_CREATED)
async def create_scale(payload: ScoreScaleCreate, db: Session = Depends(get_db)):
    scale = ScoreScale(**payload.dict())
    db.add(scale)
    db.commit()
    db.refresh(scale)
    return scale
