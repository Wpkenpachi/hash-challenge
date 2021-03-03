from app.db.database import connection
from peewee import *

class BaseModel(Model):
    class Meta:
        database = connection()