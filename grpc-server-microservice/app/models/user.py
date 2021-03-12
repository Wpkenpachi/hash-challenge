from peewee import *
from .model import BaseModel


class User(BaseModel):
    id = IntegerField(primary_key=True)
    date_of_birth = DateTimeField()
    first_name = CharField()
    last_name = CharField()

    class Meta:
        table_name = 'user'
