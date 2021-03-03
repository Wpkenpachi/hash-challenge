from .model import Model

class User(Model):
    id = None
    first_name = None
    last_name = None
    date_of_birth = None

    def __init__(self, model_shape = None):
        super().__init__(model_shape)
        self.table = "user"
