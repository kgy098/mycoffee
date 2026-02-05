"""Analysis Result model"""
from sqlalchemy import Column, Integer, JSON, Text, DateTime, ForeignKey, String, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models import Base


class AnalysisResult(Base):
    """Analysis Result (취향분석 및 결과) table model"""
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    
    # User tracking
    session_id = Column(String(64), nullable=True, index=True)
    anonymous_id = Column(String(128), nullable=True, index=True)
    ip_address = Column(String(45), nullable=True, index=True)
    user_agent = Column(String(512), nullable=True)
    user_id = Column(Integer, nullable=True, index=True)
    
    # Taste preferences (input)
    acidity = Column(Integer, nullable=False)
    sweetness = Column(Integer, nullable=False)
    body = Column(Integer, nullable=False)
    nuttiness = Column(Integer, nullable=False)
    bitterness = Column(Integer, nullable=False)
    
    # Analysis result (output)
    blend_id = Column(Integer, ForeignKey("blends.id", ondelete="SET NULL"), nullable=True)
    score = Column(JSON, nullable=True)
    interpretation = Column(Text, nullable=True)
    
    note = Column(Text, nullable=True)
    expire_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)

    # Relationships
    blend = relationship("Blend", back_populates="analysis_results")

    def __repr__(self):
        return f"<AnalysisResult(id={self.id}, user_id={self.user_id})>"
