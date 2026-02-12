"""Access log model"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models import Base


class AccessLog(Base):
    """Admin access log table model"""
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    action = Column(String(255), nullable=False)
    ip_address = Column(String(64), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    admin = relationship("User", back_populates="access_logs")

    def __repr__(self):
        return f"<AccessLog(id={self.id}, admin_id={self.admin_id}, action={self.action})>"
