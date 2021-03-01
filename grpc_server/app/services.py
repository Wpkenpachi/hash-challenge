from .repositories import UserRepository, ProductRepository, DiscountRepository
from .models import Discount
from datetime import datetime
from .utils import percentageGrossValue, getPercentageValue
import json
import grpc
import os
from .interfaces import DiscountType
from dotenv import load_dotenv
load_dotenv()

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

class CheckDiscountRuleService():
    @staticmethod
    def checkDiscountRules(user, product):
        discounts               = DiscountRepository().getAll()
        discount_percent        = 0

        for discount in discounts:
            discount["metadata"] = json.loads(discount["metadata"])
            try:
                checking = getattr(CheckDiscountRuleService, discount["title"])
                if checking(user, product, discount):
                    discount_percent += CheckDiscountRuleService.calculatePercentDiscount(discount, product)
            except ValueError as e:
                print("ERROR::DISCOUNT_METHOD_RULE_ERROR", e)
                pass
        
        return discount_percent

    @staticmethod
    def calculatePercentDiscount(discount, product) -> float:
        if discount['metadata']['type'] == DiscountType.PERCENTAGE:
            return float(discount['metadata']['percentage'])
        elif discount['metadata']['type'] == DiscountService.VALUE_IN_CENTS:
            return getPercentageValue(int(product['price_in_cents']), int(discount['metadata']['value_in_cents']))
        else:
            return 0
    
    @staticmethod
    def applyDiscount(discount_percent, product) -> int:
        MAX_DISCOUNT_PERCENTAGE = int(os.getenv('MAX_DISCOUNT_PERCENTAGE'))
        percentage_value = percentageGrossValue(int(product['price_in_cents']), discount_percent)
        return percentage_value if discount_percent <= MAX_DISCOUNT_PERCENTAGE else percentageGrossValue(int(product['price_in_cents']), MAX_DISCOUNT_PERCENTAGE)

    @staticmethod
    def maxPercentDiscount(discount_percent) -> int:
        max_discount_percentage = int(os.getenv("MAX_DISCOUNT_PERCENTAGE"))
        discount_percent = int(discount_percent)
        return max_discount_percentage if discount_percent > max_discount_percentage else discount_percent

    @staticmethod
    def IS_BIRTHDAY_USER(user=None, product=None, discount=None) -> bool:
        if not user or ('date_of_birth' not in user):
            return False
        today = datetime.today().strftime('%m-%d')
        user_birth_day = user['date_of_birth'].strftime('%m-%d')
        is_birthday_user = True if today == user_birth_day else False
        if is_birthday_user:
            return is_birthday_user
        else:
            return is_birthday_user

    @staticmethod
    def IS_BLACK_FRIDAY(user=None, product=None, discount=None) -> bool:
        if not discount:
            return False
        today = datetime.today().strftime('%m-%d')
        black_friday_day    = discount["metadata"]["day"]
        black_friday_month  = discount["metadata"]["month"]
        black_friday        = f"{black_friday_month}-{black_friday_day}"
        is_black_friday = True if today == black_friday else False
        if is_black_friday:
            return is_black_friday
        else:
            return is_black_friday