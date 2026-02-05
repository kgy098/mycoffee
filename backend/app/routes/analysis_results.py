"""Analysis Results routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import json
from app.database import get_db
from app.models import AnalysisResult, Blend, BlendOrigin
from pydantic import BaseModel

router = APIRouter()


class AnalysisResultResponse(BaseModel):
    id: int
    blend_id: Optional[int]
    blend_name: Optional[str]
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    bitterness: int
    score: Optional[dict]
    created_at: datetime
    
    class Config:
        from_attributes = True


class BlendOriginResponse(BaseModel):
    origin: str
    pct: int
    display_order: Optional[int] = None

    class Config:
        from_attributes = True


class BlendDetailResponse(BaseModel):
    id: int
    name: str
    summary: Optional[str]
    thumbnail_url: Optional[str]
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    bitterness: int

    class Config:
        from_attributes = True


class TasteProfileResponse(BaseModel):
    aroma: int
    sweetness: int
    body: int
    nutty: int
    acidity: int


class AnalysisResultDetailResponse(BaseModel):
    id: int
    created_at: datetime
    blend: Optional[BlendDetailResponse]
    taste_profile: TasteProfileResponse
    origins: List[BlendOriginResponse]
    origin_summary: Optional[str]
    summary: Optional[str]
    interpretation: Optional[str]


@router.get("/analysis-results", response_model=List[AnalysisResultResponse])
async def get_recent_analysis_results(
    user_id: Optional[int] = None,
    hours: int = 24,
    db: Session = Depends(get_db)
):
    """
    최근 분석 결과 조회 (기본 24시간 이내)
    
    Args:
        user_id: 사용자 ID (선택)
        hours: 조회할 시간 범위 (기본 24시간)
        db: 데이터베이스 세션
    
    Returns:
        List[AnalysisResultResponse]: 분석 결과 목록
    """
    # 24시간 이내 필터
    time_threshold = datetime.now() - timedelta(hours=hours)
    
    # 쿼리 구성
    query = db.query(AnalysisResult).filter(
        AnalysisResult.created_at >= time_threshold
    )
    
    if user_id:
        query = query.filter(AnalysisResult.user_id == user_id)
    
    # 최신순으로 정렬
    results = query.order_by(AnalysisResult.created_at.desc()).all()
    
    # 응답 데이터 구성
    response_data = []
    for result in results:
        blend_name = None
        if result.blend_id:
            blend = db.query(Blend).filter(Blend.id == result.blend_id).first()
            if blend:
                blend_name = blend.name
        
        response_data.append(
            AnalysisResultResponse(
                id=result.id,
                blend_id=result.blend_id,
                blend_name=blend_name,
                acidity=result.acidity,
                sweetness=result.sweetness,
                body=result.body,
                nuttiness=result.nuttiness,
                bitterness=result.bitterness,
                score=result.score,
                created_at=result.created_at
            )
        )
    
    return response_data


@router.get("/analysis-results/{result_id}", response_model=AnalysisResultDetailResponse)
async def get_analysis_result_detail(
    result_id: int,
    db: Session = Depends(get_db)
):
    """
    단일 분석 결과 상세 조회
    """
    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()

    if not result:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다")

    blend = None
    origins: List[BlendOrigin] = []
    if result.blend_id:
        blend = db.query(Blend).filter(Blend.id == result.blend_id).first()
        if blend:
            origins = (
                db.query(BlendOrigin)
                .filter(BlendOrigin.blend_id == blend.id)
                .order_by(BlendOrigin.display_order.asc(), BlendOrigin.id.asc())
                .all()
            )

    origin_summary = None
    if origins:
        origin_summary = ", ".join([f"{item.origin} {item.pct}%" for item in origins])

    summary = blend.summary if blend and blend.summary else None
    if result.interpretation:
        try:
            parsed = json.loads(result.interpretation)
            if not isinstance(parsed, (dict, list)):
                summary = result.interpretation
        except Exception:
            summary = result.interpretation

    taste_profile = TasteProfileResponse(
        aroma=result.acidity,
        sweetness=result.sweetness,
        body=result.body,
        nutty=result.nuttiness,
        acidity=result.bitterness,
    )

    return AnalysisResultDetailResponse(
        id=result.id,
        created_at=result.created_at,
        blend=BlendDetailResponse.model_validate(blend) if blend else None,
        taste_profile=taste_profile,
        origins=[BlendOriginResponse.model_validate(item) for item in origins],
        origin_summary=origin_summary,
        summary=summary,
        interpretation=result.interpretation,
    )


@router.delete("/analysis-results/{result_id}")
async def delete_analysis_result(
    result_id: int,
    db: Session = Depends(get_db)
):
    """
    분석 결과 삭제
    
    Args:
        result_id: 삭제할 분석 결과 ID
        db: 데이터베이스 세션
    
    Returns:
        삭제 성공 메시지
    """
    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다")
    
    db.delete(result)
    db.commit()
    
    return {"message": "분석 결과가 삭제되었습니다", "id": result_id}
