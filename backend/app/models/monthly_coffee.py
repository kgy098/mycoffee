"""Monthly Coffee model"""
from sqlalchemy import Column, Integer, String, Text, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models import Base


class MonthlyCoffee(Base):
    """Monthly Coffee table model"""
    __tablename__ = "monthly_coffee"

    id = Column(Integer, primary_key=True, index=True)
    blend_id = Column(Integer, ForeignKey("blends.id", ondelete="CASCADE"), nullable=False, index=True)
    month = Column(Date, nullable=False, index=True)
    comment = Column(String(255), nullable=True, comment="한줄평")
    desc = Column(Text, nullable=True, comment="내용")
    banner_url = Column(String(1024), nullable=True)
    is_visible = Column(Boolean, default=True, index=True, comment="노출/미노출")
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True, comment="등록자")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    blend = relationship("Blend", back_populates="monthly_coffees")
    creator = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<MonthlyCoffee(id={self.id})>"
