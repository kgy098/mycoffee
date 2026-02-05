"""Monthly Coffee routes"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, extract

from app.database import get_db
from app.models import MonthlyCoffee, Blend
from app.schemas.monthly_coffee import MonthlyCoffeeResponse, MonthlyCoffeeWithBlend

router = APIRouter()


@router.get("/current", response_model=List[MonthlyCoffeeWithBlend])
async def get_current_monthly_coffees(
    db: Session = Depends(get_db),
    visible_only: bool = Query(True, description="노출된 커피만 조회")
):
    """
    현재 월의 이달의 커피 목록 조회
    """
    current_date = datetime.now()
    current_year = current_date.year
    current_month = current_date.month
    
    query = db.query(
        MonthlyCoffee,
        Blend.name.label("blend_name"),
        Blend.summary.label("blend_summary"),
        Blend.thumbnail_url.label("blend_thumbnail_url"),
        Blend.price.label("blend_price"),
        Blend.acidity,
        Blend.sweetness,
        Blend.body,
        Blend.nuttiness,
        Blend.bitterness
    ).join(
        Blend, MonthlyCoffee.blend_id == Blend.id
    ).filter(
        and_(
            extract('year', MonthlyCoffee.month) == current_year,
            extract('month', MonthlyCoffee.month) == current_month,
            Blend.is_active == True
        )
    )
    
    if visible_only:
        query = query.filter(MonthlyCoffee.is_visible == True)
    
    results = query.order_by(MonthlyCoffee.created_at.desc()).all()
    
    monthly_coffees = []
    for mc, blend_name, blend_summary, blend_thumbnail_url, blend_price, acidity, sweetness, body, nuttiness, bitterness in results:
        monthly_coffees.append(MonthlyCoffeeWithBlend(
            id=mc.id,
            blend_id=mc.blend_id,
            month=mc.month,
            comment=mc.comment,
            desc=mc.desc,
            banner_url=mc.banner_url,
            is_visible=mc.is_visible,
            created_by=mc.created_by,
            created_at=mc.created_at,
            updated_at=mc.updated_at,
            blend_name=blend_name,
            blend_summary=blend_summary,
            blend_thumbnail_url=blend_thumbnail_url,
            blend_price=float(blend_price) if blend_price else None,
            acidity=acidity,
            sweetness=sweetness,
            body=body,
            nuttiness=nuttiness,
            bitterness=bitterness
        ))
    
    return monthly_coffees


@router.get("/", response_model=List[MonthlyCoffeeResponse])
async def get_monthly_coffees(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """
    모든 이달의 커피 목록 조회
    """
    monthly_coffees = db.query(MonthlyCoffee).order_by(
        MonthlyCoffee.month.desc()
    ).offset(skip).limit(limit).all()
    
    return monthly_coffees


@router.get("/{monthly_coffee_id}", response_model=MonthlyCoffeeWithBlend)
async def get_monthly_coffee(
    monthly_coffee_id: int,
    db: Session = Depends(get_db)
):
    """
    특정 이달의 커피 상세 조회
    """
    result = db.query(
        MonthlyCoffee,
        Blend.name.label("blend_name"),
        Blend.summary.label("blend_summary"),
        Blend.thumbnail_url.label("blend_thumbnail_url"),
        Blend.price.label("blend_price"),
        Blend.acidity,
        Blend.sweetness,
        Blend.body,
        Blend.nuttiness,
        Blend.bitterness
    ).join(
        Blend, MonthlyCoffee.blend_id == Blend.id
    ).filter(
        MonthlyCoffee.id == monthly_coffee_id
    ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Monthly coffee not found")
    
    mc, blend_name, blend_summary, blend_thumbnail_url, blend_price, acidity, sweetness, body, nuttiness, bitterness = result
    
    return MonthlyCoffeeWithBlend(
        id=mc.id,
        blend_id=mc.blend_id,
        month=mc.month,
        comment=mc.comment,
        desc=mc.desc,
        banner_url=mc.banner_url,
        is_visible=mc.is_visible,
        created_by=mc.created_by,
        created_at=mc.created_at,
        updated_at=mc.updated_at,
        blend_name=blend_name,
        blend_summary=blend_summary,
        blend_thumbnail_url=blend_thumbnail_url,
        blend_price=float(blend_price) if blend_price else None,
        acidity=acidity,
        sweetness=sweetness,
        body=body,
        nuttiness=nuttiness,
        bitterness=bitterness
    )
