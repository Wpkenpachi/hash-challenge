from .repositories import UserRepository, ProductRepository, DiscountRepository
from .models import Discount
from datetime import datetime
from .utils import percentageGrossValue
import json
from dotenv import load_dotenv
import os
load_dotenv()


class DiscountService():
    @staticmethod
    def getDiscount(user_id: int, product_id: int):
        user    = UserRepository().first(user_id)
        product = ProductRepository().first(product_id)

        total_percent = 0
        
        if not user or not product:
            print("DEBUG::NO USER/PRODUCT FOUND")
            print("USER: ", user)
            print("PRODUCT: ", product)
            return {
                "percentage": 0.0,
                "value_in_cents": 0
            }
        
        total_percent += CheckDiscountRuleService.checkDiscountRules(user, product)
        
        if total_percent:
            return {
                "percentage": total_percent,
                "value_in_cents": int(percentageGrossValue(int(product['price_in_cents']), total_percent))
            }
        else:
            print("DEBUG::NO MATCH DISCOUNT")
            print("USER: ", user)
            print("PRODUCT: ", product)
            return {
                "percentage": 0.0,
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
                    discount_percent += int(discount["metadata"]["percentage"])
            except ValueError:
                print("ERROR::DISCOUNT_METHOD_RULE_ERROR", ValueError)
                pass

        check = CheckDiscountRuleService.maxPercentDiscount(discount_percent)
        return check

    @staticmethod
    def maxPercentDiscount(discount_percent) -> int:
        max_discount_percentage = int(os.getenv("MAX_DISCOUNT_PERCENTAGE"))
        discount_percent = int(discount_percent)
        return max_discount_percentage if discount_percent > max_discount_percentage else discount_percent

    @staticmethod
    def IS_BIRTHDAY_USER(user, product, discount) -> bool:
        if not user or ('date_of_birth' not in user):
            # print(f"DEBUG::NO DATE OF BIRTH ON USER {user['id']}")
            return False
        today = datetime.today().strftime('%m-%d')
        user_birth_day = user['date_of_birth'].strftime('%m-%d')
        is_birthday_user = True if today == user_birth_day else False
        if is_birthday_user:
            print("IS BIRTHDAY_OF_USER:", user['id'])
            return is_birthday_user
        else:
            print(f"IS BIRTHDAY {today} <> {user_birth_day} OF USER {user['id']}")
            return is_birthday_user

    @staticmethod
    def IS_BLACK_FRIDAY(user, product, discount) -> bool:
        today = datetime.today().strftime('%m-%d')
        black_friday_day    = discount["metadata"]["day"]
        black_friday_month  = discount["metadata"]["month"]
        black_friday        = f"{black_friday_month}-{black_friday_day}"
        is_black_friday = True if today == black_friday else False
        if is_black_friday:
            print("IS BLACK FRIDAY")
            return is_black_friday
        else:
            print("DEBUG::BLACK_FRIDAY:", today, f"{black_friday_month}-{black_friday_day}", f"FOR USER {user['id']}")
            return is_black_friday