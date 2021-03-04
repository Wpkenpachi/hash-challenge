from peewee import *
from .model import BaseModel

class Discount(BaseModel):
    id = IntegerField(primary_key=True)
    title = CharField(unique=True)
    metadata = TextField(constraints=[SQL("DEFAULT '{}'::text")])

    class Meta:
        table_name = 'discount'