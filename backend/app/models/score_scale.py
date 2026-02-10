"""Score Scale model - 취향 항목별 점수(1-5) 및 설명 문구"""
from sqlalchemy import Column, BigInteger, Integer, String, Text, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.models import Base


class ScoreScale(Base):
    """취향 항목(향/산미/단맛/바디/고소함)별 점수 1~5에 대한 설명 문구"""
    __tablename__ = "score_scales"

    id = Column(BigInteger, primary_key=True, autoincrement=True, comment="PK")
    attribute_key = Column(String(32), nullable=False, index=True, comment="취향 항목 키 (aroma, acidity, sweetness, body, nutty)")
    attribute_label = Column(String(64), nullable=True, comment="취향 항목 표시명 (향, 산미, 단맛, 바디, 고소함)")
    score = Column(Integer, nullable=False, index=True, comment="점수 (1-5)")
    description = Column(Text, nullable=True, comment="해당 항목·점수에 대한 설명 문구")
    created_at = Column(DateTime, server_default=func.now(), comment="등록일시")

    __table_args__ = (UniqueConstraint("attribute_key", "score", name="uq_score_scales_attribute_score"),)

    def __repr__(self):
        return f"<ScoreScale(id={self.id}, attribute_key={self.attribute_key}, score={self.score})>"
