"""Points Ledger model"""
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.models import Base


class PointsTransactionType(str, PyEnum):
    """Points transaction type enum"""
    EARNED = "earned"
    SPENT = "spent"
    EXPIRED = "expired"


class PointsLedger(Base):
    """Points Ledger table model"""
    __tablename__ = "points_ledger"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    transaction_type = Column(Enum(PointsTransactionType), nullable=False)
    points = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=True)
    expire_at = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="points")

    def __repr__(self):
        return f"<PointsLedger(id={self.id}, type={self.transaction_type})>"
