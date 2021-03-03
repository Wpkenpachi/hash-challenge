from .model import Model

class Discount(Model):
    id = None
    title = None
    metadata = None

    def __init__(self, model_shape = None):
        super().__init__(model_shape)
        self.table = "discount"