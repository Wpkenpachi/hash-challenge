import json
import grpc
import os
from datetime import datetime

from app.models.user import User
from app.models.product import Product
from app.models.discount import Discount

from app.utils import percentageGrossValue, getPercentageValue
from app.interfaces import DiscountType

from app.services.check_discount_rule_service import CheckDiscountRuleService

class DiscountService():
    @staticmethod
    def getDiscount(product_id: int, user_id):
        total_percent = 0
        try:
            user    = User.get(User.id == user_id)
            product = Product.get(Product.id == product_id)
            
            total_percent = CheckDiscountRuleService.checkDiscountRules(user, product)
        
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
        except:
            product = Product.get(Product.id == product_id)
            total_percent = CheckDiscountRuleService.checkDiscountRules(None, product)
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