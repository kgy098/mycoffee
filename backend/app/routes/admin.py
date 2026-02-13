"""Admin routes"""
from fastapi import APIRouter, Depends, HTTPException, Query, status, Request, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, date, timedelta

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
    AnalysisResult,
    Order,
    OrderItem,
    PointsLedger,
    ScoreScale,
    Review,
)
from app.models.points_ledger import PointsTransactionType
from app.utils.security import decode_access_token, get_password_hash


def get_admin_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


async def log_admin_access(
    request: Request,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    if request.method == "OPTIONS":
        return
    ip_address = request.client.host if request.client else "unknown"
    action = f"{request.method} {request.url.path}"
    db.add(AccessLog(admin_id=admin.id, action=action, ip_address=ip_address))
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
    password: Optional[str] = None


class AdminUserUpdate(BaseModel):
    email: Optional[str] = None
    phone_number: Optional[str] = None
    display_name: Optional[str] = None
    provider: Optional[str] = None
    is_admin: Optional[bool] = None
    password: Optional[str] = None


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
    delivery_address: Optional[dict]


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
    user_name: Optional[str]
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


class AdminSubscriptionManagementResponse(BaseModel):
    subscription_id: int
    user_id: int
    user_name: Optional[str]
    blend_name: Optional[str]
    status: str
    last_payment_at: Optional[datetime]
    next_shipment_at: Optional[date]


class AdminPointsTransactionResponse(BaseModel):
    id: int
    user_id: int
    change_amount: int
    reason: str
    note: Optional[str]
    created_at: datetime


class AdminDashboardStats(BaseModel):
    today_sales: float
    new_members: int
    active_users: int
    shipping_in_progress: int


class AdminNewMember(BaseModel):
    id: int
    name: Optional[str]
    provider: Optional[str]
    created_at: datetime


class AdminPopularCoffee(BaseModel):
    blend_id: int
    name: str
    order_count: int


class AdminSalesSummary(BaseModel):
    today_sales: float
    subscription_ratio: float
    single_ratio: float


class AdminDailySales(BaseModel):
    date: date
    total_amount: float


class AdminProductSales(BaseModel):
    blend_id: int
    name: str
    order_count: int


class AdminTasteDistribution(BaseModel):
    aroma: float
    acidity: float
    sweetness: float
    body: float
    nuttiness: float


class AdminScoreScaleResponse(BaseModel):
    id: int
    attribute_key: str
    attribute_label: Optional[str]
    score: int
    description: Optional[str]


class AdminScoreScaleCreate(BaseModel):
    attribute_key: str
    attribute_label: Optional[str] = None
    score: int
    description: Optional[str] = None


class AdminScoreScaleUpdate(BaseModel):
    attribute_label: Optional[str] = None
    score: Optional[int] = None
    description: Optional[str] = None


class AdminReviewResponse(BaseModel):
    id: int
    blend_name: Optional[str]
    user_display_name: Optional[str]
    rating: Optional[int]
    status: str
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
        password_hash=get_password_hash(payload.password) if payload.password else None,
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

    payload_dict = payload.dict(exclude_unset=True)
    password = payload_dict.pop("password", None)
    for key, value in payload_dict.items():
        setattr(user, key, value)
    if password:
        user.password_hash = get_password_hash(password)
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
    user_id: Optional[int] = Query(None),
    q: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(Payment).join(Subscription, Payment.subscription_id == Subscription.id)
    if status_filter:
        query = query.filter(Payment.status == status_filter)
    if user_id:
        query = query.filter(Subscription.user_id == user_id)
    if q:
        query = query.filter(Payment.transaction_id.ilike(f"%{q}%"))

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
    q: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
    db: Session = Depends(get_db),
):
    query = db.query(Shipment).join(Subscription, Shipment.subscription_id == Subscription.id)
    if status_filter:
        query = query.filter(Shipment.status == status_filter)
    if q:
        query = query.filter(Shipment.tracking_number.ilike(f"%{q}%"))

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
        address = None
        if order.delivery_address:
            address = {
                "id": order.delivery_address.id,
                "recipient_name": order.delivery_address.recipient_name,
                "phone_number": order.delivery_address.phone_number,
                "postal_code": order.delivery_address.postal_code,
                "address_line1": order.delivery_address.address_line1,
                "address_line2": order.delivery_address.address_line2,
            }
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
                delivery_address=address,
            )
        )
    return results


@router.get("/orders/{order_id}", response_model=AdminOrderResponse)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다.")

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
    address = None
    if order.delivery_address:
        address = {
            "id": order.delivery_address.id,
            "recipient_name": order.delivery_address.recipient_name,
            "phone_number": order.delivery_address.phone_number,
            "postal_code": order.delivery_address.postal_code,
            "address_line1": order.delivery_address.address_line1,
            "address_line2": order.delivery_address.address_line2,
        }
    return AdminOrderResponse(
        id=order.id,
        order_number=order.order_number,
        order_type=order.order_type,
        status=order.status,
        user_id=order.user_id,
        user_name=order.user.display_name if order.user else None,
        total_amount=float(order.total_amount) if order.total_amount else None,
        created_at=order.created_at,
        items=items,
        delivery_address=address,
    )


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
                user_name=sub.user.display_name if sub.user else None,
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
        query = query.filter(PointsLedger.transaction_type == PointsTransactionType.EARNED)
    elif txn_type == "used":
        query = query.filter(PointsLedger.transaction_type == PointsTransactionType.SPENT)
    elif txn_type == "canceled":
        query = query.filter(PointsLedger.reason == "refund")

    results = query.order_by(PointsLedger.created_at.desc()).offset(skip).limit(limit).all()

    def _change_amount(item: PointsLedger) -> int:
        t = item.transaction_type
        if not t:
            return getattr(item, "points", 0) or 0
        v = t.value if hasattr(t, "value") else str(t)
        pts = item.points or 0
        return pts if v == "earned" else -pts

    return [
        AdminPointsTransactionResponse(
            id=item.id,
            user_id=item.user_id,
            change_amount=_change_amount(item),
            reason=item.reason or "",
            note=getattr(item, "note", None),
            created_at=item.created_at,
        )
        for item in results
    ]


@router.get("/subscriptions/management", response_model=List[AdminSubscriptionManagementResponse])
async def list_subscription_management(
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
    results: List[AdminSubscriptionManagementResponse] = []
    for sub in subscriptions:
        blend = db.query(Blend).filter(Blend.id == sub.blend_id).first()
        last_payment = (
            db.query(Payment)
            .filter(Payment.subscription_id == sub.id)
            .order_by(Payment.created_at.desc())
            .first()
        )
        next_shipment = (
            db.query(Shipment)
            .filter(Shipment.subscription_id == sub.id)
            .order_by(Shipment.scheduled_date.desc().nullslast(), Shipment.created_at.desc())
            .first()
        )
        results.append(
            AdminSubscriptionManagementResponse(
                subscription_id=sub.id,
                user_id=sub.user_id,
                user_name=sub.user.display_name if sub.user else None,
                blend_name=blend.name if blend else None,
                status=sub.status.value if hasattr(sub.status, "value") else str(sub.status),
                last_payment_at=last_payment.created_at if last_payment else None,
                next_shipment_at=next_shipment.scheduled_date if next_shipment else None,
            )
        )
    return results


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


@router.get("/dashboard/stats", response_model=AdminDashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    now = datetime.now()
    start_today = datetime.combine(now.date(), datetime.min.time())
    seven_days_ago = now - timedelta(days=7)
    one_day_ago = now - timedelta(days=1)

    today_sales = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.created_at >= start_today)
        .scalar()
    )
    new_members = (
        db.query(func.count(User.id))
        .filter(User.created_at >= one_day_ago)
        .scalar()
    )
    active_users = (
        db.query(func.count(User.id))
        .filter(User.last_login_at.isnot(None), User.last_login_at >= seven_days_ago)
        .scalar()
    )
    shipping_in_progress = (
        db.query(func.count(Shipment.id))
        .filter(Shipment.status.in_(["pending", "processing", "shipped"]))
        .scalar()
    )

    return AdminDashboardStats(
        today_sales=float(today_sales or 0),
        new_members=int(new_members or 0),
        active_users=int(active_users or 0),
        shipping_in_progress=int(shipping_in_progress or 0),
    )


@router.get("/dashboard/new-members", response_model=List[AdminNewMember])
async def get_new_members(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
    return [
        AdminNewMember(
            id=user.id,
            name=user.display_name,
            provider=user.provider,
            created_at=user.created_at,
        )
        for user in users
    ]


@router.get("/dashboard/popular-coffee", response_model=List[AdminPopularCoffee])
async def get_popular_coffee(db: Session = Depends(get_db)):
    results = (
        db.query(OrderItem.blend_id, Blend.name, func.count(OrderItem.id))
        .join(Blend, OrderItem.blend_id == Blend.id)
        .group_by(OrderItem.blend_id, Blend.name)
        .order_by(func.count(OrderItem.id).desc())
        .limit(5)
        .all()
    )
    return [
        AdminPopularCoffee(
            blend_id=blend_id,
            name=name,
            order_count=count,
        )
        for blend_id, name, count in results
    ]


@router.get("/sales/summary", response_model=AdminSalesSummary)
async def get_sales_summary(db: Session = Depends(get_db)):
    now = datetime.now()
    start_today = datetime.combine(now.date(), datetime.min.time())
    thirty_days_ago = now - timedelta(days=30)

    today_sales = (
        db.query(func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.created_at >= start_today)
        .scalar()
    )

    total_orders = (
        db.query(func.count(Order.id))
        .filter(Order.created_at >= thirty_days_ago)
        .scalar()
    )
    subscription_orders = (
        db.query(func.count(Order.id))
        .filter(Order.created_at >= thirty_days_ago, Order.order_type == "subscription")
        .scalar()
    )

    total_orders = total_orders or 0
    subscription_orders = subscription_orders or 0
    single_orders = max(total_orders - subscription_orders, 0)
    subscription_ratio = (subscription_orders / total_orders * 100) if total_orders else 0
    single_ratio = (single_orders / total_orders * 100) if total_orders else 0

    return AdminSalesSummary(
        today_sales=float(today_sales or 0),
        subscription_ratio=round(subscription_ratio, 1),
        single_ratio=round(single_ratio, 1),
    )


@router.get("/sales/daily", response_model=List[AdminDailySales])
async def get_daily_sales(db: Session = Depends(get_db)):
    today = datetime.now().date()
    start_date = today - timedelta(days=13)
    results = (
        db.query(func.date(Order.created_at), func.coalesce(func.sum(Order.total_amount), 0))
        .filter(Order.created_at >= datetime.combine(start_date, datetime.min.time()))
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )
    sales_map = {item[0]: float(item[1] or 0) for item in results}
    return [
        AdminDailySales(date=day, total_amount=sales_map.get(day, 0))
        for day in (start_date + timedelta(days=i) for i in range(14))
    ]


@router.get("/sales/products", response_model=List[AdminProductSales])
async def get_product_sales(db: Session = Depends(get_db)):
    results = (
        db.query(OrderItem.blend_id, Blend.name, func.count(OrderItem.id))
        .join(Blend, OrderItem.blend_id == Blend.id)
        .group_by(OrderItem.blend_id, Blend.name)
        .order_by(func.count(OrderItem.id).desc())
        .limit(5)
        .all()
    )
    return [
        AdminProductSales(
            blend_id=blend_id,
            name=name,
            order_count=count,
        )
        for blend_id, name, count in results
    ]


@router.get("/sales/taste-distribution", response_model=AdminTasteDistribution)
async def get_taste_distribution(db: Session = Depends(get_db)):
    row = db.query(
        func.coalesce(func.avg(AnalysisResult.aroma), 0),
        func.coalesce(func.avg(AnalysisResult.acidity), 0),
        func.coalesce(func.avg(AnalysisResult.sweetness), 0),
        func.coalesce(func.avg(AnalysisResult.body), 0),
        func.coalesce(func.avg(AnalysisResult.nuttiness), 0),
    ).first()
    return AdminTasteDistribution(
        aroma=float(row[0] or 0),
        acidity=float(row[1] or 0),
        sweetness=float(row[2] or 0),
        body=float(row[3] or 0),
        nuttiness=float(row[4] or 0),
    )


@router.get("/score-scales", response_model=List[AdminScoreScaleResponse])
async def list_score_scales(db: Session = Depends(get_db)):
    scales = db.query(ScoreScale).order_by(ScoreScale.attribute_key, ScoreScale.score).all()
    return [
        AdminScoreScaleResponse(
            id=scale.id,
            attribute_key=scale.attribute_key,
            attribute_label=scale.attribute_label,
            score=scale.score,
            description=scale.description,
        )
        for scale in scales
    ]


@router.post("/score-scales", response_model=AdminScoreScaleResponse, status_code=status.HTTP_201_CREATED)
async def create_score_scale(payload: AdminScoreScaleCreate, db: Session = Depends(get_db)):
    scale = ScoreScale(**payload.dict())
    db.add(scale)
    db.commit()
    db.refresh(scale)
    return AdminScoreScaleResponse(
        id=scale.id,
        attribute_key=scale.attribute_key,
        attribute_label=scale.attribute_label,
        score=scale.score,
        description=scale.description,
    )


@router.put("/score-scales/{scale_id}", response_model=AdminScoreScaleResponse)
async def update_score_scale(scale_id: int, payload: AdminScoreScaleUpdate, db: Session = Depends(get_db)):
    scale = db.query(ScoreScale).filter(ScoreScale.id == scale_id).first()
    if not scale:
        raise HTTPException(status_code=404, detail="항목을 찾을 수 없습니다.")

    payload_dict = payload.dict(exclude_unset=True)
    for key, value in payload_dict.items():
        setattr(scale, key, value)
    db.commit()
    db.refresh(scale)
    return AdminScoreScaleResponse(
        id=scale.id,
        attribute_key=scale.attribute_key,
        attribute_label=scale.attribute_label,
        score=scale.score,
        description=scale.description,
    )


@router.get("/reviews", response_model=List[AdminReviewResponse])
async def list_admin_reviews(db: Session = Depends(get_db)):
    results = (
        db.query(Review, Blend.name.label("blend_name"), User.display_name.label("user_display_name"))
        .join(Blend, Review.blend_id == Blend.id)
        .join(User, Review.user_id == User.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return [
        AdminReviewResponse(
            id=review.id,
            blend_name=blend_name,
            user_display_name=user_display_name,
            rating=review.rating,
            status=review.status.value if hasattr(review.status, "value") else str(review.status),
            created_at=review.created_at,
        )
        for review, blend_name, user_display_name in results
    ]
