"""SQLAlchemy ORM Models"""
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here to register them with Base
from app.models.user import User
from app.models.user_consent import UserConsent
from app.models.blend import Blend
from app.models.blend_origin import BlendOrigin
# from app.models.taste_history import TasteHistory  # Merged into AnalysisResult
from app.models.analysis_result import AnalysisResult
from app.models.subscription import Subscription
from app.models.payment import Payment
from app.models.shipment import Shipment
from app.models.review import Review
from app.models.coupon import Coupon
from app.models.coupon_redemption import CouponRedemption
from app.models.discount import Discount
from app.models.points_ledger import PointsLedger
from app.models.score_scale import ScoreScale
from app.models.user_collection import UserCollection
from app.models.monthly_coffee import MonthlyCoffee

__all__ = [
    "Base",
    "User",
    "UserConsent",
    "Blend",
    "BlendOrigin",
    # "TasteHistory",  # Merged into AnalysisResult
    "AnalysisResult",
    "Subscription",
    "Payment",
    "Shipment",
    "Review",
    "Coupon",
    "CouponRedemption",
    "Discount",
    "PointsLedger",
    "ScoreScale",
    "UserCollection",
    "MonthlyCoffee",
]
