"""User Collection model"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models import Base


class UserCollection(Base):
    """User Collection table model"""
    __tablename__ = "user_collections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    blend_id = Column(Integer, ForeignKey("blends.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="collections")
    blend = relationship("Blend", back_populates="collections")

    def __repr__(self):
        return f"<UserCollection(id={self.id})>"
