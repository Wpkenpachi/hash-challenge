from .model import Model

class Product(Model):
    id = None
    price_in_cents = None
    title = None
    description = None

    def __init__(self, model_shape = None):
        super().__init__(model_shape)
        self.table = "product"