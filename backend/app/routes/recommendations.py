"""Recommendation routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse, TastePreferences, BlendRecommendation
from app.services.recommendation import RecommendationService

router = APIRouter()


@router.post("/recommendation", response_model=RecommendationResponse)
async def get_recommendation(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    사용자의 커피 취향을 분석하고 추천 커피 목록 반환
    
    Args:
        request: 사용자의 취향 정보 (aroma, sweetness, body, nutty, acidity)
        db: 데이터베이스 세션
    
    Returns:
        RecommendationResponse: 저장된 취향과 추천 커피 목록
    """
    # 사용자 취향 객체 생성
    user_prefs = TastePreferences(
        aroma=request.aroma,
        sweetness=request.sweetness,
        body=request.body,
        nutty=request.nutty,
        acidity=request.acidity
    )
    
    # 추천 커피 조회
    blend_similarities = RecommendationService.get_recommendations(
        db=db,
        user_prefs=user_prefs,
        limit=5
    )
    
    # 응답 데이터 구성
    recommendations = [
        BlendRecommendation(
            id=blend.id,
            name=blend.name,
            summary=blend.summary,
            price=float(blend.price) if blend.price else None,
            thumbnail_url=blend.thumbnail_url,
            acidity=blend.acidity,
            sweetness=blend.sweetness,
            body=blend.body,
            nuttiness=blend.nuttiness,
            bitterness=blend.bitterness,
            similarity_score=similarity
        )
        for blend, similarity in blend_similarities
    ]
    
    # 취향 분석 저장 (save_analysis = 1인 경우)
    analysis_result_id = None
    if request.save_analysis == 1 and blend_similarities:
        # 가장 높은 유사도를 가진 커피 (첫 번째)
        top_blend, top_similarity = blend_similarities[0]
        
        # score JSON: 상위 5개 추천 정보 저장
        score_data = {
            "top_similarity": top_similarity,
            "recommendations": [
                {
                    "blend_id": blend.id,
                    "blend_name": blend.name,
                    "similarity_score": similarity
                }
                for blend, similarity in blend_similarities
            ]
        }
        
        analysis_result = RecommendationService.save_taste_history(
            db=db,
            user_prefs=user_prefs,
            user_id=request.user_id,
            blend_id=top_blend.id,
            score_data=score_data
        )
        analysis_result_id = analysis_result.id
    
    return RecommendationResponse(
        preferences=user_prefs,
        recommendations=recommendations,
        taste_history_id=analysis_result_id
    )
