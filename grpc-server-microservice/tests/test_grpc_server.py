import sys, os, json
sys.path.append("..")
from dotenv import load_dotenv
load_dotenv()

import grpc
import pytest
from proto.model_pb2 import GetDiscountRequest


from peewee import *
from app.models.user import User
from app.models.discount import Discount
from app.models.product import Product
from datetime import datetime

@pytest.fixture(scope='module')
def grpc_add_to_server():
    from proto.model_pb2_grpc import add_IndividualProductDiscountServicer_to_server
    return add_IndividualProductDiscountServicer_to_server

@pytest.fixture(scope='module')
def grpc_servicer():
    from server import IndividualProductDiscountServicer
    return IndividualProductDiscountServicer()

@pytest.fixture(scope='module')
def grpc_stub_cls(grpc_channel):
    from proto.model_pb2_grpc import IndividualProductDiscountStub
    return IndividualProductDiscountStub

def test_fetch_birthday_user(grpc_stub):
    today = datetime.today().strftime('%m-%d')
    day     = datetime.today().strftime('%d')
    month   = datetime.today().strftime('%m')
    year    = datetime.today().strftime('%Y')
    birthday_discount = Discount.select().where(Discount.title=="IS_BIRTHDAY_USER").get()
    try:
        # Getting birthday user
        birthday_user   = User.raw("SELECT * FROM public.user WHERE TO_CHAR(date_of_birth, 'MM-DD') LIKE %s", today).get()
        # Getting at least one product to send product_id
        product        = Product.select().where(Product.description == "MOCKED_PRODUCT_DESCRIPTION").get()
        # if there's a product and birthday user, we'll call gRPC server with this inputs and compare response percentage with database stored discount percentage
        if  product and birthday_user:
            request = GetDiscountRequest(product_id=product.id, user_id=birthday_user.id)
            response = grpc_stub.FetchDiscount(request)
            metadata = json.loads(birthday_discount.metadata)
            assert int(metadata["percentage"]) == int(response.percentage)
    except:
        # Creating birthday user
        user_id = User.insert({
            "first_name": "A Birthday User",
            "last_name": "LAST_SEED_NAME",
            "date_of_birth": datetime.strptime(f"{month}-{day}-1996 00:10:00", '%m-%d-%Y %H:%M:%S').strftime('%m-%d-%y %H:%M:%S')
        }).execute()
        birthday_user   = User.get(user_id)
        # Getting at least one product to send product_id
        product         = Product.select().where(Product.description == "MOCKED_PRODUCT_DESCRIPTION").get()
        # if there's a product and birthday user, we'll call gRPC server with this inputs and compare response percentage with database stored discount percentage
        if  product and birthday_user:
            request = GetDiscountRequest(product_id=product.id, user_id=birthday_user.id)
            response = grpc_stub.FetchDiscount(request)
            metadata = json.loads(birthday_discount.metadata)
            assert int(metadata["percentage"]) == int(response.percentage)
    
def test_fetch_black_friday(grpc_stub):
    original_black_friday_discount = Discount.select().where(Discount.title=="IS_BLACK_FRIDAY").get()
    original_metadata = json.loads(original_black_friday_discount.metadata)

    # Setting blackfriday for today
    day     = datetime.today().strftime('%d')
    month   = datetime.today().strftime('%m')
    metadata = json.loads(Discount.select().where(Discount.title=="IS_BLACK_FRIDAY").get().metadata)
    metadata["day"] = day
    metadata["month"] = month
    (Discount
    .update(metadata=json.dumps(metadata))
    .where(Discount.title == "IS_BLACK_FRIDAY")
    .execute())

    # Getting at least one product to send product_id
    product         = Product.select().where(Product.description == "MOCKED_PRODUCT_DESCRIPTION").get()
    # Send request while is black friday
    request = GetDiscountRequest(product_id=product.id, user_id=-1)
    # get discount
    response = grpc_stub.FetchDiscount(request)

     # Reset blackfriday for correct day
    (Discount
    .update(metadata=json.dumps(original_metadata))
    .where(Discount.title == "IS_BLACK_FRIDAY")
    .execute())

    # check assert percentage
    assert int(response.percentage)  == int(original_metadata["percentage"])

def test_fetchDiscount_invalid_user_and_product(grpc_stub):
    request = GetDiscountRequest(product_id=-1, user_id=-1)
    try:
        response = grpc_stub.FetchDiscount(request)
    except grpc.RpcError as e:
        assert e.code() == grpc.StatusCode.UNKNOWN
    