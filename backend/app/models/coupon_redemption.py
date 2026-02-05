"""Coupon Redemption model"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models import Base


class CouponRedemption(Base):
    """Coupon Redemption table model"""
    __tablename__ = "coupon_redemptions"

    id = Column(Integer, primary_key=True, index=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    redeemed_at = Column(DateTime, server_default=func.now())

    # Relationships
    coupon = relationship("Coupon", back_populates="redemptions")

    def __repr__(self):
        return f"<CouponRedemption(id={self.id})>"
