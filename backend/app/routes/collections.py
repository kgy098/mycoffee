"""User collection routes"""
import logging
import time
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db

logger = logging.getLogger(__name__)
from app.models import UserCollection, Blend, BlendOrigin, AnalysisResult
from pydantic import BaseModel

router = APIRouter()


class CollectionSaveRequest(BaseModel):
    user_id: int
    analysis_result_id: Optional[int] = None
    blend_id: int
    collection_name: str
    personal_comment: str


class CollectionListItem(BaseModel):
    id: int
    collection_name: Optional[str]
    personal_comment: Optional[str]
    blend_id: int
    blend_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CollectionDetailResponse(BaseModel):
    id: int
    collection_name: Optional[str]
    personal_comment: Optional[str]
    created_at: datetime
    analysis_result_id: Optional[int]
    blend: Optional[dict]
    origins: List[dict]
    origin_summary: Optional[str]
    taste_profile: Optional[dict]
    summary: Optional[str]


@router.get("/collections", response_model=List[CollectionListItem])
async def list_collections(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    results = (
        db.query(UserCollection, Blend.name.label("blend_name"))
        .join(Blend, UserCollection.blend_id == Blend.id)
        .filter(UserCollection.user_id == user_id)
        .order_by(UserCollection.created_at.desc())
        .all()
    )

    items = []
    for collection, blend_name in results:
        items.append(
            CollectionListItem(
                id=collection.id,
                collection_name=collection.collection_name,
                personal_comment=collection.personal_comment,
                blend_id=collection.blend_id,
                blend_name=blend_name,
                created_at=collection.created_at,
            )
        )
    return items


@router.post("/collections/save", response_model=CollectionListItem)
async def save_collection(
    payload: CollectionSaveRequest,
    db: Session = Depends(get_db)
):
    duplicate = (
        db.query(UserCollection)
        .filter(
            UserCollection.user_id == payload.user_id,
            UserCollection.collection_name == payload.collection_name,
        )
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=409, detail="이미 저장된 내 커피 이름입니다.")

    collection = UserCollection(
        user_id=payload.user_id,
        blend_id=payload.blend_id,
        analysis_result_id=payload.analysis_result_id,
        collection_name=payload.collection_name,
        personal_comment=payload.personal_comment,
    )
    db.add(collection)
    db.commit()
    db.refresh(collection)

    blend = db.query(Blend).filter(Blend.id == payload.blend_id).first()
    return CollectionListItem(
        id=collection.id,
        collection_name=collection.collection_name,
        personal_comment=collection.personal_comment,
        blend_id=collection.blend_id,
        blend_name=blend.name if blend else None,
        created_at=collection.created_at,
    )


@router.put("/collections/{collection_id}", response_model=CollectionListItem)
async def update_collection(
    collection_id: int,
    payload: CollectionSaveRequest,
    db: Session = Depends(get_db)
):
    collection = db.query(UserCollection).filter(UserCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="컬렉션을 찾을 수 없습니다.")

    collection.collection_name = payload.collection_name
    collection.personal_comment = payload.personal_comment
    collection.analysis_result_id = payload.analysis_result_id
    collection.blend_id = payload.blend_id
    db.commit()
    db.refresh(collection)

    blend = db.query(Blend).filter(Blend.id == collection.blend_id).first()
    return CollectionListItem(
        id=collection.id,
        collection_name=collection.collection_name,
        personal_comment=collection.personal_comment,
        blend_id=collection.blend_id,
        blend_name=blend.name if blend else None,
        created_at=collection.created_at,
    )


@router.get("/collections/{collection_id}", response_model=CollectionDetailResponse)
async def get_collection_detail(
    collection_id: int,
    db: Session = Depends(get_db)
):
    t0 = time.perf_counter()
    logger.info("[PERF] collections.get_detail collection_id=%s stage=start", collection_id)

    collection = db.query(UserCollection).filter(UserCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="컬렉션을 찾을 수 없습니다.")
    logger.info("[PERF] collections.get_detail collection_id=%s stage=collection_query elapsed_ms=%.1f", collection_id, (time.perf_counter() - t0) * 1000)

    blend = db.query(Blend).filter(Blend.id == collection.blend_id).first()
    origins = []
    if blend:
        origins = (
            db.query(BlendOrigin)
            .filter(BlendOrigin.blend_id == blend.id)
            .order_by(BlendOrigin.display_order.asc(), BlendOrigin.id.asc())
            .all()
        )
    logger.info("[PERF] collections.get_detail collection_id=%s stage=blend_origins elapsed_ms=%.1f", collection_id, (time.perf_counter() - t0) * 1000)

    origin_summary = None
    if origins:
        origin_summary = ", ".join([f"{item.origin} {item.pct}%" for item in origins])

    taste_profile = None
    summary = blend.summary if blend else None

    if collection.analysis_result_id:
        analysis = db.query(AnalysisResult).filter(AnalysisResult.id == collection.analysis_result_id).first()
        logger.info("[PERF] collections.get_detail collection_id=%s stage=analysis_result elapsed_ms=%.1f", collection_id, (time.perf_counter() - t0) * 1000)
        if analysis:
            taste_profile = {
                "aroma": analysis.aroma,
                "acidity": analysis.acidity,
                "sweetness": analysis.sweetness,
                "body": analysis.body,
                "nuttiness": analysis.nuttiness,
            }
            # summary는 블렌드 한줄 요약만 사용. AI 스토리는 별도 GET /api/analytics/ai-story/{id} 로 조회

    blend_payload = None
    if blend:
        blend_payload = {
            "id": blend.id,
            "name": blend.name,
            "summary": blend.summary,
            "aroma": blend.aroma,
            "acidity": blend.acidity,
            "sweetness": blend.sweetness,
            "body": blend.body,
            "nuttiness": blend.nuttiness,
            "thumbnail_url": blend.thumbnail_url,
        }

    logger.info("[PERF] collections.get_detail collection_id=%s stage=done total_elapsed_ms=%.1f", collection_id, (time.perf_counter() - t0) * 1000)
    return CollectionDetailResponse(
        id=collection.id,
        collection_name=collection.collection_name,
        personal_comment=collection.personal_comment,
        created_at=collection.created_at,
        analysis_result_id=collection.analysis_result_id,
        blend=blend_payload,
        origins=[{"origin": item.origin, "pct": item.pct} for item in origins],
        origin_summary=origin_summary,
        taste_profile=taste_profile,
        summary=summary,
    )


@router.delete("/collections/{collection_id}")
async def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db)
):
    collection = db.query(UserCollection).filter(UserCollection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="컬렉션을 찾을 수 없습니다.")

    db.delete(collection)
    db.commit()
    return {"message": "컬렉션이 삭제되었습니다.", "id": collection_id}
