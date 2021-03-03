from app.models.user import User

class UserRepository(User):
    def __init__(self):
        super().__init__()