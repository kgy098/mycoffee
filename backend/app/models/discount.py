"""Discount model"""
from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.models import Base


class DiscountType(str, PyEnum):
    """Discount type enum"""
    PERCENTAGE = "percentage"
    FIXED = "fixed"


class Discount(Base):
    """Discount table model"""
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    discount_type = Column(Enum(DiscountType), nullable=False)
    discount_value = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<Discount(id={self.id}, name={self.name})>"
