"""Pydantic schemas for request/response"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


# Blend Schemas
class BlendCreate(BaseModel):
    """Create blend request"""
    name: str
    origin_ratios: dict
    summary: Optional[str] = None
    attributes: dict
    price: Optional[float] = None
    stock: int = 0
    thumbnail_url: Optional[str] = None


class BlendResponse(BaseModel):
    """Blend response"""
    id: int
    name: str
    origin_ratios: dict
    summary: Optional[str]
    attributes: dict
    price: Optional[float]
    stock: int
    thumbnail_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# User Schemas
class UserCreate(BaseModel):
    """Create user request"""
    email: str
    password: str
    display_name: Optional[str] = None


class UserResponse(BaseModel):
    """User response"""
    id: int
    email: str
    display_name: Optional[str]
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Subscription Schemas
class SubscriptionCreate(BaseModel):
    """Create subscription request"""
    blend_id: int
    start_date: date


class SubscriptionResponse(BaseModel):
    """Subscription response"""
    id: int
    user_id: int
    blend_id: int
    status: str
    next_billing_date: Optional[date]
    created_at: datetime

    class Config:
        from_attributes = True


# Review Schemas
class ReviewCreate(BaseModel):
    """Create review request"""
    blend_id: int
    rating: Optional[int] = None
    content: Optional[str] = None
    photo_url: Optional[str] = None


class ReviewResponse(BaseModel):
    """Review response"""
    id: int
    user_id: int
    blend_id: int
    rating: Optional[int]
    content: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Taste History Schemas
class TasteHistoryCreate(BaseModel):
    """Create taste history request"""
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    bitterness: int
    note: Optional[str] = None
    anonymous_id: Optional[str] = None
    ip_address: Optional[str] = None


class TasteHistoryResponse(BaseModel):
    """Taste history response"""
    id: int
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    bitterness: int
    created_at: datetime

    class Config:
        from_attributes = True


# Score Scale Schemas
class ScoreScaleCreate(BaseModel):
    label: Optional[str] = None
    description: Optional[str] = None


class ScoreScaleResponse(BaseModel):
    id: int
    label: Optional[str]
    description: Optional[str]

    class Config:
        from_attributes = True
