from peewee import *
from .model import BaseModel

class Product(BaseModel):
    id = IntegerField(primary_key=True)
    description = CharField()
    price_in_cents = IntegerField()
    title = CharField()

    class Meta:
        table_name = 'product'