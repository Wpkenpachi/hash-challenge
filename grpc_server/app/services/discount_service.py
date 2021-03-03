import json
import grpc
import os
from datetime import datetime
# from dotenv import load_dotenv
# load_dotenv()

from app.repositories.user_repository import UserRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.discount_repository import DiscountRepository
from app.models.discount import Discount

from app.utils import percentageGrossValue, getPercentageValue
from app.interfaces import DiscountType

from app.services.check_discount_rule_service import CheckDiscountRuleService

class DiscountService():
    @staticmethod
    def getDiscount(product_id: int, user_id: int):
        user    = UserRepository().first(user_id)
        product = ProductRepository().first(product_id)

        total_percent = 0
        
        if not user:
            return {
                "error": "USER_NOT_FOUND",
                "code": grpc.StatusCode.NOT_FOUND
            }
        
        total_percent += CheckDiscountRuleService.checkDiscountRules(user, product)
        
        if total_percent:
            return {
                "percentage": total_percent,
                "value_in_cents": CheckDiscountRuleService.applyDiscount(total_percent, product)
            }
        else:
            return {
                "percentage": 0,
                "value_in_cents": 0
            }