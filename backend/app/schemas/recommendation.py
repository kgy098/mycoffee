"""Recommendation schemas"""
from pydantic import BaseModel, Field
from typing import List, Optional


class TastePreferences(BaseModel):
    """사용자의 커피 취향"""
    aroma: int = Field(..., ge=1, le=5, description="향 (1-5)")
    sweetness: int = Field(..., ge=1, le=5, description="단맛 (1-5)")
    body: int = Field(..., ge=1, le=5, description="바디 (1-5)")
    nutty: int = Field(..., ge=1, le=5, description="고소함 (1-5)")
    acidity: int = Field(..., ge=1, le=5, description="산미 (1-5)")


class RecommendationRequest(BaseModel):
    """추천 요청"""
    aroma: int = Field(..., ge=1, le=5)
    sweetness: int = Field(..., ge=1, le=5)
    body: int = Field(..., ge=1, le=5)
    nutty: int = Field(..., ge=1, le=5)
    acidity: int = Field(..., ge=1, le=5)
    user_id: Optional[int] = None
    save_analysis: int = Field(default=0, description="취향 분석 저장 여부 (0: 저장안함, 1: 저장)")


class BlendRecommendation(BaseModel):
    """추천 커피 blend"""
    id: int
    name: str
    summary: Optional[str]
    price: Optional[float]
    thumbnail_url: Optional[str]
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    bitterness: int
    similarity_score: float = Field(..., description="유사도 점수 (0-100)")

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    """추천 응답"""
    preferences: TastePreferences
    recommendations: List[BlendRecommendation]
    taste_history_id: Optional[int] = Field(None, description="저장된 취향분석 ID")
