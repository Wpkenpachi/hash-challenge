from .models import BaseModel

# Models
from .models import User, Product, Discount

class UserRepository(User):
    def __init__(self):
        super().__init__()

class ProductRepository(Product):
    def __init__(self):
        super().__init__()

class DiscountRepository(Discount):
    def __init__(self):
        super().__init__()