"""Blend routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.blend import Blend
from app.schemas import BlendCreate, BlendResponse

router = APIRouter()


@router.get("/", response_model=list[BlendResponse])
async def list_blends(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """List all active blends"""
    blends = db.query(Blend).filter(Blend.is_active == True).offset(skip).limit(limit).all()
    return blends


@router.get("/{blend_id}", response_model=BlendResponse)
async def get_blend(blend_id: int, db: Session = Depends(get_db)):
    """Get single blend by ID"""
    blend = db.query(Blend).filter(Blend.id == blend_id).first()
    if not blend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blend not found")
    return blend


@router.post("/", response_model=BlendResponse)
async def create_blend(blend: BlendCreate, db: Session = Depends(get_db)):
    """Create new blend (Admin only)"""
    db_blend = Blend(**blend.dict())
    db.add(db_blend)
    db.commit()
    db.refresh(db_blend)
    return db_blend


@router.put("/{blend_id}", response_model=BlendResponse)
async def update_blend(blend_id: int, blend: BlendCreate, db: Session = Depends(get_db)):
    """Update blend (Admin only)"""
    db_blend = db.query(Blend).filter(Blend.id == blend_id).first()
    if not db_blend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blend not found")
    
    for key, value in blend.dict().items():
        setattr(db_blend, key, value)
    
    db.commit()
    db.refresh(db_blend)
    return db_blend
