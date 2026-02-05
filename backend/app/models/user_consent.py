"""User consent model"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.models import Base


class UserConsent(Base):
    """User consent table model"""
    __tablename__ = "user_consents"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    consent_type = Column(String(64), nullable=False)  # terms, privacy, marketing, marketing_sms, marketing_email, marketing_push
    is_agreed = Column(Boolean, nullable=False)
    agreed_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<UserConsent(user_id={self.user_id}, consent_type={self.consent_type}, is_agreed={self.is_agreed})>"
