"""Analytics routes for taste analysis details"""
import json
import logging
import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Any

from app.database import get_db

logger = logging.getLogger(__name__)
from app.models import AnalysisResult, Blend, BlendOrigin, AiStory
from app.schemas.recommendation import TastePreferences
from app.services.recommendation import RecommendationService
from app.services.ai_story import generate_ai_story
from pydantic import BaseModel

router = APIRouter()


class AiStorySection(BaseModel):
    title: str
    icon: str
    content: List[str]


class AiStoryResponse(BaseModel):
    sections: List[AiStorySection]


class SimilarBlendResponse(BaseModel):
    id: int
    name: str
    summary: Optional[str]
    aroma: int
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    similarity_score: Optional[float] = None

    class Config:
        from_attributes = True


def _build_default_story(origins: List[BlendOrigin]) -> List[AiStorySection]:
    origin_text = "다양한 원산지의 조화"
    if origins:
        origin_text = ", ".join([f"{item.origin} {item.pct}%" for item in origins])

    return [
        AiStorySection(
            title="이렇게 즐겨보세요.",
            icon="🌱",
            content=[
                "원두는 중·굵게 분쇄해보세요. 너무 곱게 갈면 이 부드러운 하모니가 무겁게 눌려버립니다.",
                "핸드드립으로 내리면 향이 선명하게 피어나고, 프렌치프레스를 쓰면 고소하고 크리미한 바디감이 강조됩니다.",
                "혹은 진한 풍미를 원한다면 에스프레소로 짧고 강렬하게 즐겨도 좋습니다.",
            ],
        ),
        AiStorySection(
            title="함께하면 좋은 순간",
            icon="🍰",
            content=[
                "이 커피에는 치즈케이크 한 조각이 잘 어울립니다. 치즈의 크리미함이 커피의 바디와 맞물려 부드럽게 감싸줍니다.",
                f"원산지 조합({origin_text})의 균형 덕분에 견과류 디저트와도 잘 어울립니다.",
            ],
        ),
        AiStorySection(
            title="오늘은 이런 음악과",
            icon="🎶",
            content=[
                "잔잔히 흐르는 노라 존스(Norah Jones)의 목소리, 혹은 드뷔시의 Clair de Lune을 틀어두면 어떨까요?",
                "커피의 부드러운 크리미함과 음악의 서정성이 서로 겹치며, 평범한 오후를 특별한 순간으로 바꿔줍니다.",
            ],
        ),
        AiStorySection(
            title="영화와 함께라면",
            icon="🎬",
            content=[
                "한 잔의 커피와 함께라면, Before Sunrise 같은 영화가 잘 어울립니다. 대화 속에 잔잔히 흐르는 낭만이 이 블렌드의 향기와 닮아 있습니다.",
                "혹은 리틀 포레스트처럼 따뜻한 위로를 전하는 영화도 좋습니다. 커피 향처럼 은은하게 스며드는 치유의 시간이 될 거예요.",
            ],
        ),
    ]


def _sections_to_response(sections: List[dict]) -> AiStoryResponse:
    """dict 리스트를 AiStoryResponse로 변환"""
    return AiStoryResponse(
        sections=[AiStorySection(**s) for s in sections]
    )


def _normalize_story(raw: Any) -> Optional[List[AiStorySection]]:
    if not raw:
        return None

    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except Exception:
            return None

    if isinstance(raw, dict):
        if "sections" in raw:
            raw = raw["sections"]
        elif "ai_story" in raw:
            raw = raw["ai_story"]
        elif "story" in raw:
            raw = raw["story"]

    if not isinstance(raw, list):
        return None

    sections: List[AiStorySection] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        title = item.get("title")
        icon = item.get("icon", "☕")
        content = item.get("content")
        if title and isinstance(content, list):
            sections.append(
                AiStorySection(
                    title=str(title),
                    icon=str(icon),
                    content=[str(text) for text in content if text],
                )
            )

    return sections or None


def _get_origin_text(origins: List[BlendOrigin]) -> str:
    if not origins:
        return "다양한 원산지의 조화"
    return ", ".join([f"{o.origin} {o.pct}%" for o in origins])


@router.get("/ai-story/{result_id}", response_model=AiStoryResponse)
async def get_ai_story(
    result_id: int,
    db: Session = Depends(get_db)
):
    """
    분석 결과 기반 AI 스토리 반환.
    - ai_stories 테이블에 있으면 그대로 반환 (취향분석 상세/컬렉션 상세 공통).
    - 없으면 취향분석 상세에서만 생성·저장 후 반환. 컬렉션은 analysis_result_id로 조회만.
    """
    t0 = time.perf_counter()
    logger.info("[PERF] analytics.ai_story result_id=%s stage=start", result_id)

    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다")
    logger.info("[PERF] analytics.ai_story result_id=%s stage=analysis_result_query elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)

    # 1) ai_stories 테이블 조회 (저장된 스토리 우선)
    row = db.query(AiStory).filter(AiStory.analysis_result_id == result_id).first()
    logger.info("[PERF] analytics.ai_story result_id=%s stage=ai_stories_query elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)
    if row and row.sections:
        sections = _normalize_story(row.sections)
        if sections:
            logger.info("[PERF] analytics.ai_story result_id=%s stage=return_from_ai_stories total_elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)
            return AiStoryResponse(sections=sections)

    # 2) 구 데이터 호환: analysis_results.interpretation
    story_sections = _normalize_story(result.interpretation)
    logger.info("[PERF] analytics.ai_story result_id=%s stage=interpretation_check elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)
    if story_sections:
        logger.info("[PERF] analytics.ai_story result_id=%s stage=return_from_interpretation total_elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)
        return AiStoryResponse(sections=story_sections)

    # 3) 없으면 생성 후 ai_stories에 저장 (취향분석 상세 진입 시 1회)
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
    logger.info("[PERF] analytics.ai_story result_id=%s stage=blend_origins elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)

    if blend:
        t_openai = time.perf_counter()
        generated = generate_ai_story(
            blend_name=blend.name,
            summary=blend.summary or "",
            aroma=result.aroma,
            acidity=result.acidity,
            sweetness=result.sweetness,
            body=result.body,
            nuttiness=result.nuttiness,
            origin_text=_get_origin_text(origins),
        )
        logger.info("[PERF] analytics.ai_story result_id=%s stage=openai_generate openai_elapsed_ms=%.1f total_elapsed_ms=%.1f", result_id, (time.perf_counter() - t_openai) * 1000, (time.perf_counter() - t0) * 1000)
        if generated:
            story_sections = [AiStorySection(**s) for s in generated]
            try:
                db.add(AiStory(
                    analysis_result_id=result_id,
                    blend_id=result.blend_id,
                    sections=[s.model_dump() for s in story_sections],
                ))
                db.commit()
            except Exception:
                db.rollback()
            logger.info("[PERF] analytics.ai_story result_id=%s stage=return_from_generated total_elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)
            return AiStoryResponse(sections=story_sections)

    story_sections = _build_default_story(origins)
    logger.info("[PERF] analytics.ai_story result_id=%s stage=return_default total_elapsed_ms=%.1f", result_id, (time.perf_counter() - t0) * 1000)
    return AiStoryResponse(sections=story_sections)


@router.get("/ai-story/by-blend/{blend_id}", response_model=AiStoryResponse)
async def get_ai_story_by_blend(
    blend_id: int,
    db: Session = Depends(get_db)
):
    """
    블렌드 ID 기반 AI 스토리 반환 (이달의 커피 상세 등). OpenAI로 생성.
    """
    blend = db.query(Blend).filter(Blend.id == blend_id).first()
    if not blend:
        raise HTTPException(status_code=404, detail="블렌드를 찾을 수 없습니다")

    origins = (
        db.query(BlendOrigin)
        .filter(BlendOrigin.blend_id == blend.id)
        .order_by(BlendOrigin.display_order.asc(), BlendOrigin.id.asc())
        .all()
    )
    origin_text = _get_origin_text(origins)

    generated = generate_ai_story(
        blend_name=blend.name,
        summary=blend.summary or "",
        aroma=blend.aroma,
        acidity=blend.acidity,
        sweetness=blend.sweetness,
        body=blend.body,
        nuttiness=blend.nuttiness,
        origin_text=origin_text,
    )

    if generated:
        return _sections_to_response(generated)
    return AiStoryResponse(sections=_build_default_story(origins))


@router.get("/similar/{result_id}", response_model=List[SimilarBlendResponse])
async def get_similar_blends(
    result_id: int,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    분석 결과와 유사한 커피 목록 반환
    """
    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다")

    user_prefs = TastePreferences(
        aroma=result.aroma,
        acidity=result.acidity,
        sweetness=result.sweetness,
        body=result.body,
        nuttiness=result.nuttiness,
    )

    candidates = RecommendationService.get_recommendations(
        db=db,
        user_prefs=user_prefs,
        limit=limit + 3,
    )

    filtered = []
    for blend, similarity in candidates:
        if result.blend_id and blend.id == result.blend_id:
            continue
        filtered.append(
            SimilarBlendResponse(
                id=blend.id,
                name=blend.name,
                summary=blend.summary,
                aroma=blend.aroma,
                acidity=blend.acidity,
                sweetness=blend.sweetness,
                body=blend.body,
                nuttiness=blend.nuttiness,
                similarity_score=similarity,
            )
        )
        if len(filtered) >= limit:
            break

    return filtered


@router.get("/similar/by-blend/{blend_id}", response_model=List[SimilarBlendResponse])
async def get_similar_blends_by_blend(
    blend_id: int,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    블렌드 ID 기반 유사 추천 커피 목록 반환
    """
    blend = db.query(Blend).filter(Blend.id == blend_id).first()
    if not blend:
        raise HTTPException(status_code=404, detail="블렌드를 찾을 수 없습니다")

    user_prefs = TastePreferences(
        aroma=blend.aroma,
        acidity=blend.acidity,
        sweetness=blend.sweetness,
        body=blend.body,
        nuttiness=blend.nuttiness,
    )

    candidates = RecommendationService.get_recommendations(
        db=db,
        user_prefs=user_prefs,
        limit=limit + 2,
    )

    filtered = []
    for candidate_blend, similarity in candidates:
        if candidate_blend.id == blend.id:
            continue
        filtered.append(
            SimilarBlendResponse(
                id=candidate_blend.id,
                name=candidate_blend.name,
                summary=candidate_blend.summary,
                aroma=candidate_blend.aroma,
                acidity=candidate_blend.acidity,
                sweetness=candidate_blend.sweetness,
                body=candidate_blend.body,
                nuttiness=candidate_blend.nuttiness,
                similarity_score=similarity,
            )
        )
        if len(filtered) >= limit:
            break
    return filtered
