"""Score Scale model"""
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.models import Base


class ScoreScale(Base):
    """Score Scale table model"""
    __tablename__ = "score_scales"

    id = Column(Integer, primary_key=True, index=True)
    attribute = Column(String(64), nullable=False, index=True)
    level = Column(Integer, nullable=False)
    label = Column(String(128), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<ScoreScale(id={self.id}, attribute={self.attribute})>"
