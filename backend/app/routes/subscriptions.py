"""Subscription routes"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Subscription, Blend, DeliveryAddress, Order
from pydantic import BaseModel

router = APIRouter()


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    blend_id: int
    blend_name: Optional[str]
    status: str
    start_date: datetime | None
    next_billing_date: datetime | None
    delivery_address: Optional[dict]
    options: Optional[dict]
    quantity: int
    total_cycles: int
    current_cycle: int
    total_amount: Optional[float]


class SubscriptionCreateRequest(BaseModel):
    user_id: int
    blend_id: int
    delivery_address_id: Optional[int] = None
    total_amount: Optional[float] = None
    quantity: int = 1
    total_cycles: int = 0
    first_delivery_date: datetime
    options: Optional[dict] = None
    payment_method: Optional[str] = None
    points_used: int = 0
    discount_amount: Optional[float] = None
    delivery_fee: Optional[float] = None


class SubscriptionOrderResponse(BaseModel):
    order_id: int
    order_number: str
    order_date: datetime


@router.get("/subscriptions", response_model=List[SubscriptionResponse])
async def list_subscriptions(
    user_id: int = Query(...),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Subscription).filter(Subscription.user_id == user_id)
    if status:
        query = query.filter(Subscription.status == status)

    subscriptions = query.order_by(Subscription.created_at.desc()).all()
    results = []
    for sub in subscriptions:
        blend = db.query(Blend).filter(Blend.id == sub.blend_id).first()
        address = None
        if sub.delivery_address:
            address = {
                "id": sub.delivery_address.id,
                "recipient_name": sub.delivery_address.recipient_name,
                "phone_number": sub.delivery_address.phone_number,
                "postal_code": sub.delivery_address.postal_code,
                "address_line1": sub.delivery_address.address_line1,
                "address_line2": sub.delivery_address.address_line2,
            }
        results.append(
            SubscriptionResponse(
                id=sub.id,
                user_id=sub.user_id,
                blend_id=sub.blend_id,
                blend_name=blend.name if blend else None,
                status=sub.status.value if hasattr(sub.status, "value") else str(sub.status),
                start_date=sub.start_date,
                next_billing_date=sub.next_billing_date,
                delivery_address=address,
                options=sub.options,
                quantity=sub.quantity,
                total_cycles=sub.total_cycles,
                current_cycle=sub.current_cycle,
                total_amount=float(sub.total_amount) if sub.total_amount else None,
            )
        )
    return results


@router.post("/subscriptions", response_model=SubscriptionResponse)
async def create_subscription(
    payload: SubscriptionCreateRequest,
    db: Session = Depends(get_db)
):
    start_date = payload.first_delivery_date.date()
    next_billing_date = start_date - timedelta(days=2)

    subscription = Subscription(
        user_id=payload.user_id,
        blend_id=payload.blend_id,
        start_date=start_date,
        next_billing_date=next_billing_date,
        status="active",
        payment_method=payload.payment_method,
        total_amount=payload.total_amount,
        delivery_address_id=payload.delivery_address_id,
        options=payload.options,
        quantity=payload.quantity,
        total_cycles=payload.total_cycles,
        current_cycle=1 if payload.total_cycles else 0,
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return await get_subscription_detail(subscription.id, db)


@router.get("/subscriptions/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription_detail(
    subscription_id: int,
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="구독을 찾을 수 없습니다.")

    blend = db.query(Blend).filter(Blend.id == sub.blend_id).first()
    address = None
    if sub.delivery_address:
        address = {
            "id": sub.delivery_address.id,
            "recipient_name": sub.delivery_address.recipient_name,
            "phone_number": sub.delivery_address.phone_number,
            "postal_code": sub.delivery_address.postal_code,
            "address_line1": sub.delivery_address.address_line1,
            "address_line2": sub.delivery_address.address_line2,
        }

    return SubscriptionResponse(
        id=sub.id,
        user_id=sub.user_id,
        blend_id=sub.blend_id,
        blend_name=blend.name if blend else None,
        status=sub.status.value if hasattr(sub.status, "value") else str(sub.status),
        start_date=sub.start_date,
        next_billing_date=sub.next_billing_date,
        delivery_address=address,
        options=sub.options,
        quantity=sub.quantity,
        total_cycles=sub.total_cycles,
        current_cycle=sub.current_cycle,
        total_amount=float(sub.total_amount) if sub.total_amount else None,
    )


@router.get("/subscriptions/{subscription_id}/orders", response_model=List[SubscriptionOrderResponse])
async def list_subscription_orders(
    subscription_id: int,
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(Order.subscription_id == subscription_id).order_by(Order.created_at.desc()).all()
    return [
        SubscriptionOrderResponse(
            order_id=order.id,
            order_number=order.order_number,
            order_date=order.created_at,
        )
        for order in orders
    ]


@router.put("/subscriptions/{subscription_id}/pause", response_model=SubscriptionResponse)
async def pause_subscription(
    subscription_id: int,
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="구독을 찾을 수 없습니다.")

    sub.status = "paused"
    sub.pause_until = sub.next_billing_date
    db.commit()
    return await get_subscription_detail(subscription_id, db)


@router.put("/subscriptions/{subscription_id}/resume", response_model=SubscriptionResponse)
async def resume_subscription(
    subscription_id: int,
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="구독을 찾을 수 없습니다.")

    sub.status = "active"
    sub.pause_until = None
    db.commit()
    return await get_subscription_detail(subscription_id, db)
