"""User model"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models import Base


class User(Base):
    """User table model (social login + email)"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    display_name = Column(String(128), nullable=True)
    provider = Column(String(32), nullable=True)  # kakao, naver, apple, email
    provider_id = Column(String(255), nullable=True)
    profile_image_url = Column(String(1024), nullable=True)
    phone_number = Column(String(20), nullable=False)
    birth_date = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)  # male, female, other
    signup_purpose = Column(String(255), nullable=True)
    is_admin = Column(Boolean, default=False)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    subscriptions = relationship("Subscription", back_populates="user")
    reviews = relationship("Review", foreign_keys="Review.user_id", back_populates="user")
    collections = relationship("UserCollection", back_populates="user")
    points = relationship("PointsLedger", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, provider={self.provider})>"
