"""Points routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import PointsLedger
from app.models.points_ledger import PointsTransactionType
from pydantic import BaseModel

router = APIRouter()


class PointsBalanceResponse(BaseModel):
    user_id: int
    balance: int


class PointsTransactionResponse(BaseModel):
    id: int
    user_id: int
    change_amount: int
    reason: Optional[str]
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


def _ledger_change(item: PointsLedger) -> int:
    """transaction_type + points → change_amount (부호 반영)"""
    if not item.transaction_type:
        return getattr(item, "points", 0) or 0
    t = item.transaction_type.value if hasattr(item.transaction_type, "value") else str(item.transaction_type)
    pts = item.points or 0
    return pts if t == "earned" else -pts


@router.get("/points/balance", response_model=PointsBalanceResponse)
async def get_points_balance(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    rows = db.query(PointsLedger).filter(PointsLedger.user_id == user_id).all()
    total = sum(_ledger_change(item) for item in rows)
    return PointsBalanceResponse(user_id=user_id, balance=total)


@router.get("/points/transactions", response_model=List[PointsTransactionResponse])
async def get_points_transactions(
    user_id: int = Query(...),
    txn_type: str = Query("all", description="all|earned|used|canceled"),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(PointsLedger).filter(PointsLedger.user_id == user_id)

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

    results = query.order_by(PointsLedger.created_at.desc()).all()
    return [
        PointsTransactionResponse(
            id=item.id,
            user_id=item.user_id,
            change_amount=_ledger_change(item),
            reason=item.reason,
            created_at=item.created_at,
        )
        for item in results
    ]
