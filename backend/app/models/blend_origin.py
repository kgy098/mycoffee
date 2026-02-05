"""Blend Origin model"""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models import Base


class BlendOrigin(Base):
    """Blend Origin (블렌드 원산지 배합) table model"""
    __tablename__ = "blend_origins"

    id = Column(Integer, primary_key=True, index=True)
    blend_id = Column(Integer, ForeignKey("blends.id", ondelete="CASCADE"), nullable=False, index=True)
    origin = Column(String(128), nullable=False, index=True)
    pct = Column(Integer, nullable=False)
    display_order = Column(Integer, default=0)

    # Relationships
    blend = relationship("Blend", back_populates="origins")

    def __repr__(self):
        return f"<BlendOrigin(id={self.id}, blend_id={self.blend_id}, origin={self.origin}, pct={self.pct})>"
