"""Payment model"""
from sqlalchemy import Column, Integer, String, DateTime, Numeric, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.models import Base


class PaymentStatus(str, PyEnum):
    """Payment status enum"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class Payment(Base):
    """Payment table model"""
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="KRW")
    payment_method = Column(String(64), nullable=True)
    transaction_id = Column(String(255), unique=True, nullable=True, index=True)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, index=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    subscription = relationship("Subscription", back_populates="payments")

    def __repr__(self):
        return f"<Payment(id={self.id}, status={self.status})>"
