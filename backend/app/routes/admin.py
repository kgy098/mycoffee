"""Admin routes"""
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from pydantic import BaseModel
from app.database import get_db
from app.models import (
    User,
    Subscription,
    Payment,
    Shipment,
    Blend,
    CoffeeStory,
    CoffeeTip,
    Event,
    AccessLog,
    Order,
    OrderItem,
    PointsLedger,
)
from app.utils.security import decode_access_token


async def log_admin_access(
    request: Request,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if request.method == "OPTIONS":
        return
    if not authorization or not authorization.startswith("Bearer "):
        return

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        return

    user_id = payload.get("sub")
    if not user_id:
        return

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        return

    ip_address = request.client.host if request.client else "unknown"
    action = f"{request.method} {request.url.path}"
    db.add(AccessLog(admin_id=user.id, action=action, ip_address=ip_address))
    db.commit()


router = APIRouter(dependencies=[Depends(log_admin_access)])


class AdminUserResponse(BaseModel):
    id: int
    email: str
    display_name: Optional[str]
    phone_number: Optional[str]
    provider: Optional[str]
    is_admin: bool
    created_at: datetime
    subscription_count: int


class AdminUserCreate(BaseModel):
    email: str
    phone_number: str
    display_name: Optional[str] = None
    provider: Optional[str] = "email"
    is_admin: bool = False


class AdminUserUpdate(BaseModel):
    email: Optional[str] = None
    phone_number: Optional[str] = None
    display_name: Optional[str] = None
    provider: Optional[str] = None
    is_admin: Optional[bool] = None


class AdminPaymentResponse(BaseModel):
    id: int
    subscription_id: int
    user_id: int
    amount: float
    status: str
    payment_method: Optional[str]
    created_at: datetime


class AdminOrderItem(BaseModel):
    id: int
    blend_name: Optional[str]
    collection_name: Optional[str]
    quantity: int
    unit_price: Optional[float]


class AdminOrderResponse(BaseModel):
    id: int
    order_number: str
    order_type: str
    status: str
    user_id: int
    user_name: Optional[str]
    total_amount: Optional[float]
    created_at: datetime
    items: List[AdminOrderItem]


class AdminShipmentResponse(BaseModel):
    id: int
    subscription_id: int
    user_id: int
    blend_name: Optional[str]
    tracking_number: Optional[str]
    carrier: Optional[str]
    status: str
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]
    scheduled_date: Optional[date]


class AdminBlendResponse(BaseModel):
    id: int
    name: str
    summary: Optional[str]
    aroma: int
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    price: Optional[float]
    stock: int
    thumbnail_url: Optional[str]
    is_active: bool
    created_at: datetime


class AdminBlendCreate(BaseModel):
    name: str
    summary: Optional[str] = None
    aroma: int
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    price: Optional[float] = None
    stock: int = 0
    thumbnail_url: Optional[str] = None
    is_active: bool = True


class AdminBlendUpdate(BaseModel):
    name: Optional[str] = None
    summary: Optional[str] = None
    aroma: Optional[int] = None
    acidity: Optional[int] = None
    sweetness: Optional[int] = None
    body: Optional[int] = None
    nuttiness: Optional[int] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    thumbnail_url: Optional[str] = None
    is_active: Optional[bool] = None


class AdminPostResponse(BaseModel):
    id: int
    category: str
    title: str
    created_at: datetime
    status: str


class AdminRewardResponse(BaseModel):
    id: int
    event_title: str
    reward_points: int
    status: str
    created_at: datetime


class AdminAccessLogResponse(BaseModel):
    id: int
    admin_id: int
    action: str
    ip_address: str
    created_at: datetime


class AdminSubscriptionResponse(BaseModel):
    id: int
    user_id: int
    blend_id: int
    blend_name: Optional[str]
    status: str
    start_date: Optional[date]
    next_billing_date: Optional[date]
    delivery_address: Optional[dict]
    options: Optional[dict]
    quantity: int
    total_cycles: int
    current_cycle: int
    total_amount: Optional[float]


class AdminPointsTransactionResponse(BaseModel):
    id: int
    user_id: int
    change_amount: int
    reason: str
    note: Optional[str]
    created_at: datetime


@router.get("/users", response_model=List[AdminUserResponse])
async def list_users(
    q: Optional[str] = Query(None),
    provider: Optional[str] = Query(None),
    is_admin: Optional[bool] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(User)
    if q:
        query = query.filter(User.email.ilike(f"%{q}%") | User.display_name.ilike(f"%{q}%"))
    if provider:
        query = query.filter(User.provider == provider)
    if is_admin is not None:
        query = query.filter(User.is_admin == is_admin)

    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    return [
        AdminUserResponse(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
            phone_number=user.phone_number,
            provider=user.provider,
            is_admin=user.is_admin,
            created_at=user.created_at,
            subscription_count=len(user.subscriptions),
        )
        for user in users
    ]


@router.get("/users/{user_id}", response_model=AdminUserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return AdminUserResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        phone_number=user.phone_number,
        provider=user.provider,
        is_admin=user.is_admin,
        created_at=user.created_at,
        subscription_count=len(user.subscriptions),
    )


@router.post("/users", response_model=AdminUserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(payload: AdminUserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=409, detail="이미 존재하는 이메일입니다.")

    user = User(
        email=payload.email,
        phone_number=payload.phone_number,
        display_name=payload.display_name,
        provider=payload.provider,
        is_admin=payload.is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return AdminUserResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        phone_number=user.phone_number,
        provider=user.provider,
        is_admin=user.is_admin,
        created_at=user.created_at,
        subscription_count=0,
    )


@router.put("/users/{user_id}", response_model=AdminUserResponse)
async def update_user(user_id: int, payload: AdminUserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return AdminUserResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        phone_number=user.phone_number,
        provider=user.provider,
        is_admin=user.is_admin,
        created_at=user.created_at,
        subscription_count=len(user.subscriptions),
    )


@router.get("/payments", response_model=List[AdminPaymentResponse])
async def list_payments(
    status_filter: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(Payment).join(Subscription, Payment.subscription_id == Subscription.id)
    if status_filter:
        query = query.filter(Payment.status == status_filter)

    payments = query.order_by(Payment.created_at.desc()).offset(skip).limit(limit).all()
    return [
        AdminPaymentResponse(
            id=payment.id,
            subscription_id=payment.subscription_id,
            user_id=payment.subscription.user_id,
            amount=float(payment.amount),
            status=payment.status.value if hasattr(payment.status, "value") else str(payment.status),
            payment_method=payment.payment_method,
            created_at=payment.created_at,
        )
        for payment in payments
    ]


@router.get("/payments/{payment_id}", response_model=AdminPaymentResponse)
async def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="결제 정보를 찾을 수 없습니다.")
    return AdminPaymentResponse(
        id=payment.id,
        subscription_id=payment.subscription_id,
        user_id=payment.subscription.user_id,
        amount=float(payment.amount),
        status=payment.status.value if hasattr(payment.status, "value") else str(payment.status),
        payment_method=payment.payment_method,
        created_at=payment.created_at,
    )


@router.get("/shipments", response_model=List[AdminShipmentResponse])
async def list_shipments(
    status_filter: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(Shipment).join(Subscription, Shipment.subscription_id == Subscription.id)
    if status_filter:
        query = query.filter(Shipment.status == status_filter)

    shipments = query.order_by(Shipment.created_at.desc()).offset(skip).limit(limit).all()
    results: List[AdminShipmentResponse] = []
    for shipment in shipments:
        blend_name = None
        if shipment.subscription and shipment.subscription.blend_id:
            blend = db.query(Blend).filter(Blend.id == shipment.subscription.blend_id).first()
            blend_name = blend.name if blend else None
        results.append(
            AdminShipmentResponse(
                id=shipment.id,
                subscription_id=shipment.subscription_id,
                user_id=shipment.subscription.user_id,
                blend_name=blend_name,
                tracking_number=shipment.tracking_number,
                carrier=shipment.carrier,
                status=shipment.status.value if hasattr(shipment.status, "value") else str(shipment.status),
                shipped_at=shipment.shipped_at,
                delivered_at=shipment.delivered_at,
                scheduled_date=shipment.scheduled_date,
            )
        )
    return results


@router.get("/orders", response_model=List[AdminOrderResponse])
async def list_orders(
    q: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    order_type: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(Order)
    if q:
        query = query.filter(Order.order_number.ilike(f"%{q}%"))
    if status_filter:
        query = query.filter(Order.status == status_filter)
    if order_type:
        query = query.filter(Order.order_type == order_type)
    if user_id:
        query = query.filter(Order.user_id == user_id)

    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    results: List[AdminOrderResponse] = []
    for order in orders:
        items = []
        for item in order.items:
            blend_name = item.blend.name if item.blend else None
            items.append(
                AdminOrderItem(
                    id=item.id,
                    blend_name=blend_name,
                    collection_name=item.collection_name,
                    quantity=item.quantity,
                    unit_price=float(item.unit_price) if item.unit_price else None,
                )
            )
        results.append(
            AdminOrderResponse(
                id=order.id,
                order_number=order.order_number,
                order_type=order.order_type,
                status=order.status,
                user_id=order.user_id,
                user_name=order.user.display_name if order.user else None,
                total_amount=float(order.total_amount) if order.total_amount else None,
                created_at=order.created_at,
                items=items,
            )
        )
    return results


@router.get("/subscriptions", response_model=List[AdminSubscriptionResponse])
async def list_all_subscriptions(
    status: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(Subscription)
    if status:
        query = query.filter(Subscription.status == status)
    if user_id:
        query = query.filter(Subscription.user_id == user_id)

    subscriptions = query.order_by(Subscription.created_at.desc()).offset(skip).limit(limit).all()
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
            AdminSubscriptionResponse(
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


@router.get("/points/transactions", response_model=List[AdminPointsTransactionResponse])
async def list_point_transactions(
    user_id: Optional[int] = Query(None),
    txn_type: str = Query("all", description="all|earned|used|canceled"),
    year: Optional[int] = Query(None),
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
):
    query = db.query(PointsLedger)
    if user_id:
        query = query.filter(PointsLedger.user_id == user_id)

    if year:
        query = query.filter(PointsLedger.created_at >= datetime(year, 1, 1)).filter(
            PointsLedger.created_at < datetime(year + 1, 1, 1)
        )

    if txn_type == "earned":
        query = query.filter(PointsLedger.change_amount > 0)
    elif txn_type == "used":
        query = query.filter(PointsLedger.change_amount < 0)
    elif txn_type == "canceled":
        query = query.filter(PointsLedger.reason == "refund")

    results = query.order_by(PointsLedger.created_at.desc()).offset(skip).limit(limit).all()
    return [
        AdminPointsTransactionResponse(
            id=item.id,
            user_id=item.user_id,
            change_amount=item.change_amount,
            reason=item.reason,
            note=item.note,
            created_at=item.created_at,
        )
        for item in results
    ]


@router.get("/blends", response_model=List[AdminBlendResponse])
async def list_blends(
    q: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(Blend)
    if q:
        query = query.filter(Blend.name.ilike(f"%{q}%"))
    if is_active is not None:
        query = query.filter(Blend.is_active == is_active)

    blends = query.order_by(Blend.created_at.desc()).offset(skip).limit(limit).all()
    return [
        AdminBlendResponse(
            id=blend.id,
            name=blend.name,
            summary=blend.summary,
            aroma=blend.aroma,
            acidity=blend.acidity,
            sweetness=blend.sweetness,
            body=blend.body,
            nuttiness=blend.nuttiness,
            price=float(blend.price) if blend.price is not None else None,
            stock=blend.stock,
            thumbnail_url=blend.thumbnail_url,
            is_active=blend.is_active,
            created_at=blend.created_at,
        )
        for blend in blends
    ]


@router.get("/blends/{blend_id}", response_model=AdminBlendResponse)
async def get_blend(blend_id: int, db: Session = Depends(get_db)):
    blend = db.query(Blend).filter(Blend.id == blend_id).first()
    if not blend:
        raise HTTPException(status_code=404, detail="커피 상품을 찾을 수 없습니다.")
    return AdminBlendResponse(
        id=blend.id,
        name=blend.name,
        summary=blend.summary,
        aroma=blend.aroma,
        acidity=blend.acidity,
        sweetness=blend.sweetness,
        body=blend.body,
        nuttiness=blend.nuttiness,
        price=float(blend.price) if blend.price is not None else None,
        stock=blend.stock,
        thumbnail_url=blend.thumbnail_url,
        is_active=blend.is_active,
        created_at=blend.created_at,
    )


@router.post("/blends", response_model=AdminBlendResponse, status_code=status.HTTP_201_CREATED)
async def create_blend(payload: AdminBlendCreate, db: Session = Depends(get_db)):
    blend = Blend(
        name=payload.name,
        summary=payload.summary,
        aroma=payload.aroma,
        acidity=payload.acidity,
        sweetness=payload.sweetness,
        body=payload.body,
        nuttiness=payload.nuttiness,
        price=payload.price,
        stock=payload.stock,
        thumbnail_url=payload.thumbnail_url,
        is_active=payload.is_active,
    )
    db.add(blend)
    db.commit()
    db.refresh(blend)
    return AdminBlendResponse(
        id=blend.id,
        name=blend.name,
        summary=blend.summary,
        aroma=blend.aroma,
        acidity=blend.acidity,
        sweetness=blend.sweetness,
        body=blend.body,
        nuttiness=blend.nuttiness,
        price=float(blend.price) if blend.price is not None else None,
        stock=blend.stock,
        thumbnail_url=blend.thumbnail_url,
        is_active=blend.is_active,
        created_at=blend.created_at,
    )


@router.put("/blends/{blend_id}", response_model=AdminBlendResponse)
async def update_blend(blend_id: int, payload: AdminBlendUpdate, db: Session = Depends(get_db)):
    blend = db.query(Blend).filter(Blend.id == blend_id).first()
    if not blend:
        raise HTTPException(status_code=404, detail="커피 상품을 찾을 수 없습니다.")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(blend, key, value)
    db.commit()
    db.refresh(blend)
    return AdminBlendResponse(
        id=blend.id,
        name=blend.name,
        summary=blend.summary,
        aroma=blend.aroma,
        acidity=blend.acidity,
        sweetness=blend.sweetness,
        body=blend.body,
        nuttiness=blend.nuttiness,
        price=float(blend.price) if blend.price is not None else None,
        stock=blend.stock,
        thumbnail_url=blend.thumbnail_url,
        is_active=blend.is_active,
        created_at=blend.created_at,
    )


@router.get("/posts", response_model=List[AdminPostResponse])
async def list_posts(db: Session = Depends(get_db)):
    stories = db.query(CoffeeStory).order_by(CoffeeStory.created_at.desc()).all()
    tips = db.query(CoffeeTip).order_by(CoffeeTip.created_at.desc()).all()
    events = db.query(Event).order_by(Event.created_at.desc()).all()

    results: List[AdminPostResponse] = []
    for story in stories:
        results.append(
            AdminPostResponse(
                id=story.id,
                category="커피스토리",
                title=story.title,
                created_at=story.created_at,
                status="공개",
            )
        )
    for tip in tips:
        results.append(
            AdminPostResponse(
                id=tip.id,
                category="커피잡담",
                title=tip.title,
                created_at=tip.created_at,
                status="공개",
            )
        )
    for event in events:
        results.append(
            AdminPostResponse(
                id=event.id,
                category="이벤트",
                title=event.title,
                created_at=event.created_at,
                status=event.status,
            )
        )
    return sorted(results, key=lambda item: item.created_at, reverse=True)


@router.get("/rewards/events", response_model=List[AdminRewardResponse])
async def list_event_rewards(db: Session = Depends(get_db)):
    events = db.query(Event).order_by(Event.created_at.desc()).all()
    return [
        AdminRewardResponse(
            id=event.id,
            event_title=event.title,
            reward_points=event.reward_points or 0,
            status=event.status,
            created_at=event.created_at,
        )
        for event in events
    ]


@router.get("/admins", response_model=List[AdminUserResponse])
async def list_admins(db: Session = Depends(get_db)):
    admins = db.query(User).filter(User.is_admin == True).order_by(User.created_at.desc()).all()
    return [
        AdminUserResponse(
            id=admin.id,
            email=admin.email,
            display_name=admin.display_name,
            phone_number=admin.phone_number,
            provider=admin.provider,
            is_admin=admin.is_admin,
            created_at=admin.created_at,
            subscription_count=len(admin.subscriptions),
        )
        for admin in admins
    ]


@router.get("/access-logs", response_model=List[AdminAccessLogResponse])
async def list_access_logs(
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    logs = db.query(AccessLog).order_by(AccessLog.created_at.desc()).offset(skip).limit(limit).all()
    return [
        AdminAccessLogResponse(
            id=log.id,
            admin_id=log.admin_id,
            action=log.action,
            ip_address=log.ip_address,
            created_at=log.created_at,
        )
        for log in logs
    ]
