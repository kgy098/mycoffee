"""Review routes"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import Review, Blend, User, OrderItem, Order, PointsLedger
from app.models.points_ledger import PointsTransactionType
from pydantic import BaseModel

router = APIRouter()


class ReviewCreateRequest(BaseModel):
    user_id: int
    blend_id: int
    rating: int
    content: str
    photo_url: Optional[str] = None
    order_item_id: Optional[int] = None


class ReviewListItem(BaseModel):
    id: int
    user_id: int
    user_display_name: Optional[str]
    rating: Optional[int]
    content: Optional[str]
    photo_url: Optional[str]
    blend_id: int
    blend_name: Optional[str]
    created_at: datetime
    likes: int = 0

    class Config:
        from_attributes = True


class ReviewDetailResponse(ReviewListItem):
    status: str
    points_awarded: bool


class ReviewableOrderItem(BaseModel):
    order_item_id: int
    order_id: int
    order_number: str
    order_date: datetime
    blend_id: Optional[int]
    blend_name: Optional[str]
    options: Optional[dict]
    quantity: int
    unit_price: Optional[float] = None


@router.get("/reviews", response_model=List[ReviewListItem])
async def list_reviews(
    sort: str = Query("latest", description="latest|popular|rating_desc|rating_asc"),
    photo_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    query = db.query(Review, Blend.name.label("blend_name"), User.display_name.label("user_display_name")).join(
        Blend, Review.blend_id == Blend.id
    ).join(
        User, Review.user_id == User.id
    )

    if photo_only:
        query = query.filter(Review.photo_url.isnot(None))

    if sort == "rating_desc":
        query = query.order_by(desc(Review.rating))
    elif sort == "rating_asc":
        query = query.order_by(asc(Review.rating))
    else:
        query = query.order_by(desc(Review.created_at))

    results = query.all()
    items = []
    for review, blend_name, user_display_name in results:
        items.append(
            ReviewListItem(
                id=review.id,
                user_id=review.user_id,
                user_display_name=user_display_name,
                rating=review.rating,
                content=review.content,
                photo_url=review.photo_url,
                blend_id=review.blend_id,
                blend_name=blend_name,
                created_at=review.created_at,
                likes=0,
            )
        )
    return items


@router.get("/reviews/{review_id}", response_model=ReviewDetailResponse)
async def get_review_detail(
    review_id: int,
    db: Session = Depends(get_db)
):
    result = (
        db.query(Review, Blend.name.label("blend_name"), User.display_name.label("user_display_name"))
        .join(Blend, Review.blend_id == Blend.id)
        .join(User, Review.user_id == User.id)
        .filter(Review.id == review_id)
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="리뷰를 찾을 수 없습니다.")

    review, blend_name, user_display_name = result
    return ReviewDetailResponse(
        id=review.id,
        user_id=review.user_id,
        user_display_name=user_display_name,
        rating=review.rating,
        content=review.content,
        photo_url=review.photo_url,
        blend_id=review.blend_id,
        blend_name=blend_name,
        created_at=review.created_at,
        likes=0,
        status=review.status.value if hasattr(review.status, "value") else str(review.status),
        points_awarded=review.points_awarded,
    )


@router.get("/reviews/user/{user_id}", response_model=List[ReviewDetailResponse])
async def list_user_reviews(
    user_id: int,
    db: Session = Depends(get_db)
):
    results = (
        db.query(Review, Blend.name.label("blend_name"), User.display_name.label("user_display_name"))
        .join(Blend, Review.blend_id == Blend.id)
        .join(User, Review.user_id == User.id)
        .filter(Review.user_id == user_id)
        .order_by(desc(Review.created_at))
        .all()
    )

    items = []
    for review, blend_name, user_display_name in results:
        items.append(
            ReviewDetailResponse(
                id=review.id,
                user_id=review.user_id,
                user_display_name=user_display_name,
                rating=review.rating,
                content=review.content,
                photo_url=review.photo_url,
                blend_id=review.blend_id,
                blend_name=blend_name,
                created_at=review.created_at,
                likes=0,
                status=review.status.value if hasattr(review.status, "value") else str(review.status),
                points_awarded=review.points_awarded,
            )
        )
    return items


@router.get("/reviews/reviewable", response_model=List[ReviewableOrderItem])
async def list_reviewable_order_items(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    results = (
        db.query(OrderItem, Order.order_number, Order.created_at, Blend.name.label("blend_name"))
        .join(Order, OrderItem.order_id == Order.id)
        .join(Blend, OrderItem.blend_id == Blend.id)
        .filter(Order.user_id == user_id, Order.status == "delivered")
        .order_by(desc(Order.created_at))
        .all()
    )

    reviewable = []
    for item, order_number, created_at, blend_name in results:
        already_reviewed = (
            db.query(Review)
            .filter(Review.user_id == user_id, Review.blend_id == item.blend_id)
            .first()
        )
        if already_reviewed:
            continue
        reviewable.append(
            ReviewableOrderItem(
                order_item_id=item.id,
                order_id=item.order_id,
                order_number=order_number,
                order_date=created_at,
                blend_id=item.blend_id,
                blend_name=blend_name,
                options=item.options,
                quantity=item.quantity,
                unit_price=float(item.unit_price) if item.unit_price else None,
            )
        )
    return reviewable


@router.post("/reviews", response_model=ReviewDetailResponse)
async def create_review(
    payload: ReviewCreateRequest,
    db: Session = Depends(get_db)
):
    review = Review(
        user_id=payload.user_id,
        blend_id=payload.blend_id,
        rating=payload.rating,
        content=payload.content,
        photo_url=payload.photo_url,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    if payload.photo_url:
        ledger = PointsLedger(
            user_id=payload.user_id,
            transaction_type=PointsTransactionType.EARNED,
            points=1000,
            reason="review",
        )
        db.add(ledger)
        review.points_awarded = True
        db.commit()

    blend = db.query(Blend).filter(Blend.id == review.blend_id).first()
    user = db.query(User).filter(User.id == review.user_id).first()

    return ReviewDetailResponse(
        id=review.id,
        user_id=review.user_id,
        user_display_name=user.display_name if user else None,
        rating=review.rating,
        content=review.content,
        photo_url=review.photo_url,
        blend_id=review.blend_id,
        blend_name=blend.name if blend else None,
        created_at=review.created_at,
        likes=0,
        status=review.status.value if hasattr(review.status, "value") else str(review.status),
        points_awarded=review.points_awarded,
    )
