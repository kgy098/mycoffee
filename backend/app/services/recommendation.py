"""Recommendation service"""
from sqlalchemy.orm import Session
from app.models import Blend, AnalysisResult
from app.schemas.recommendation import TastePreferences, BlendRecommendation
from typing import List, Tuple
import math


class RecommendationService:
    """커피 추천 서비스"""

    @staticmethod
    def calculate_euclidean_distance(user_prefs: TastePreferences, blend: Blend) -> float:
        """
        유클리드 거리를 이용한 유사도 계산
        거리가 작을수록 유사도가 높음
        """
        distance = math.sqrt(
            (user_prefs.aroma - blend.acidity) ** 2 +
            (user_prefs.sweetness - blend.sweetness) ** 2 +
            (user_prefs.body - blend.body) ** 2 +
            (user_prefs.nutty - blend.nuttiness) ** 2 +
            (user_prefs.acidity - blend.bitterness) ** 2
        )
        return distance

    @staticmethod
    def distance_to_similarity_score(distance: float) -> float:
        """
        거리값을 0-100 유사도 점수로 변환
        거리 0 (완전히 같음) = 100점
        거리 5√5 (완전히 다름) = 0점
        """
        max_distance = 5 * math.sqrt(5)  # 약 11.18
        if distance >= max_distance:
            return 0.0
        similarity = (1 - (distance / max_distance)) * 100
        return round(similarity, 2)

    @staticmethod
    def get_recommendations(
        db: Session,
        user_prefs: TastePreferences,
        limit: int = 5
    ) -> List[Tuple[Blend, float]]:
        """
        사용자 취향과 유사한 blend 조회 및 유사도 계산
        
        Returns:
            List[(Blend, similarity_score)] - 유사도가 높은 순서로 정렬
        """
        # 활성화된 모든 blend 조회
        blends = db.query(Blend).filter(Blend.is_active == True).all()

        # 각 blend의 유사도 계산
        blend_similarities = []
        for blend in blends:
            distance = RecommendationService.calculate_euclidean_distance(user_prefs, blend)
            similarity = RecommendationService.distance_to_similarity_score(distance)
            blend_similarities.append((blend, similarity))

        # 유사도가 높은 순서로 정렬
        blend_similarities.sort(key=lambda x: x[1], reverse=True)

        # 상위 limit개만 반환
        return blend_similarities[:limit]

    @staticmethod
    def save_taste_history(
        db: Session,
        user_prefs: TastePreferences,
        user_id: int = None,
        blend_id: int = None,
        score_data: dict = None
    ) -> AnalysisResult:
        """
        사용자의 취향 분석 결과를 analysis_results에 저장
        """
        # analysis_results 모델의 컬럼명: acidity, sweetness, body, nuttiness, bitterness
        # 사용자 입력: aroma, sweetness, body, nutty, acidity
        # 매핑: aroma -> acidity (첫 번째), acidity -> bitterness (마지막)
        analysis_result = AnalysisResult(
            user_id=user_id,
            acidity=user_prefs.aroma,  # aroma를 acidity에 매핑
            sweetness=user_prefs.sweetness,
            body=user_prefs.body,
            nuttiness=user_prefs.nutty,  # nutty를 nuttiness에 매핑
            bitterness=user_prefs.acidity,  # acidity를 bitterness에 매핑
            blend_id=blend_id,  # 가장 유사도가 높은 커피 ID
            score=score_data  # 추천 결과 JSON
        )
        
        db.add(analysis_result)
        db.commit()
        db.refresh(analysis_result)
        
        return analysis_result
