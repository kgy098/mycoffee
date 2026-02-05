"""Monthly Coffee schemas"""
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class MonthlyCoffeeBase(BaseModel):
    """Base Monthly Coffee schema"""
    blend_id: int
    month: date
    comment: Optional[str] = None
    desc: Optional[str] = None
    banner_url: Optional[str] = None
    is_visible: bool = True


class MonthlyCoffeeCreate(MonthlyCoffeeBase):
    """Monthly Coffee creation schema"""
    created_by: Optional[int] = None


class MonthlyCoffeeUpdate(BaseModel):
    """Monthly Coffee update schema"""
    blend_id: Optional[int] = None
    month: Optional[date] = None
    comment: Optional[str] = None
    desc: Optional[str] = None
    banner_url: Optional[str] = None
    is_visible: Optional[bool] = None


class MonthlyCoffeeResponse(MonthlyCoffeeBase):
    """Monthly Coffee response schema"""
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MonthlyCoffeeWithBlend(MonthlyCoffeeResponse):
    """Monthly Coffee with Blend details"""
    blend_name: str
    blend_summary: Optional[str] = None
    blend_thumbnail_url: Optional[str] = None
    blend_price: Optional[float] = None
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    bitterness: int

    class Config:
        from_attributes = True
