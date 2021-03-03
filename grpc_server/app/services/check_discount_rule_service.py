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
        elif discount['metadata']['type'] == DiscountType.VALUE_IN_CENTS:
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