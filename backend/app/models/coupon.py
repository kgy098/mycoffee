"""Coupon model"""
from sqlalchemy import Column, Integer, String, Text, Numeric, Date, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.models import Base


class DiscountType(str, PyEnum):
    """Discount type enum"""
    PERCENTAGE = "percentage"
    FIXED = "fixed"


class Coupon(Base):
    """Coupon table model"""
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    discount_type = Column(Enum(DiscountType), nullable=False)
    discount_value = Column(Numeric(10, 2), nullable=False)
    valid_from = Column(Date, nullable=True)
    valid_until = Column(Date, nullable=True, index=True)
    max_uses = Column(Integer, nullable=True)
    
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    redemptions = relationship("CouponRedemption", back_populates="coupon")

    def __repr__(self):
        return f"<Coupon(id={self.id}, code={self.code})>"
