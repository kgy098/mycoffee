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
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.delivery_address import DeliveryAddress
from app.models.coupon import Coupon
from app.models.coupon_redemption import CouponRedemption
from app.models.discount import Discount
from app.models.points_ledger import PointsLedger
from app.models.inquiry import Inquiry
from app.models.coffee_story import CoffeeStory
from app.models.coffee_tip import CoffeeTip
from app.models.event import Event
from app.models.access_log import AccessLog
from app.models.score_scale import ScoreScale
from app.models.user_collection import UserCollection
from app.models.monthly_coffee import MonthlyCoffee
from app.models.ai_story import AiStory

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
    "Order",
    "OrderItem",
    "DeliveryAddress",
    "Coupon",
    "CouponRedemption",
    "Discount",
    "PointsLedger",
    "Inquiry",
    "CoffeeStory",
    "CoffeeTip",
    "Event",
    "AccessLog",
    "ScoreScale",
    "UserCollection",
    "MonthlyCoffee",
    "AiStory",
]
