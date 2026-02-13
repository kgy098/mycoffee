"""Subscription model"""
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.models import Base


class SubscriptionStatus(str, PyEnum):
    ACTIVE = "active"
    PAUSED = "paused"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PENDING_PAYMENT = "pending_payment"  # 토스 결제 완료 대기


class Subscription(Base):
    """Subscription table model"""
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    blend_id = Column(Integer, ForeignKey("blends.id", ondelete="RESTRICT"), nullable=False)
    start_date = Column(Date, nullable=False)
    next_billing_date = Column(Date, nullable=True, index=True)
    billing_cycle = Column(Enum("monthly"), default="monthly")
    status = Column(
        Enum(SubscriptionStatus, values_callable=lambda x: [e.value for e in x]),
        default=SubscriptionStatus.ACTIVE,
        index=True,
    )
    pause_until = Column(Date, nullable=True)
    payment_method = Column(String(64), nullable=True)
    total_amount = Column(Numeric(10, 2), nullable=True)
    delivery_address_id = Column(Integer, ForeignKey("delivery_addresses.id", ondelete="SET NULL"), nullable=True)
    options = Column(JSON, nullable=True)
    quantity = Column(Integer, default=1)
    total_cycles = Column(Integer, default=0)
    current_cycle = Column(Integer, default=0)
    discount_id = Column(Integer, ForeignKey("discounts.id"), nullable=True)
    failed_payment_attempts = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="subscriptions")
    blend = relationship("Blend", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription")
    shipments = relationship("Shipment", back_populates="subscription")
    delivery_address = relationship("DeliveryAddress")

    def __repr__(self):
        return f"<Subscription(id={self.id}, status={self.status})>"
