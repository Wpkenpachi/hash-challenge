import sys, os
sys.path.append("..")
import grpc
import pytest
from proto.model_pb2 import GetDiscountRequest

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

def test_fetchDiscount_valid_product(grpc_stub):
    request = GetDiscountRequest(product_id=0, user_id=0)
    response = grpc_stub.FetchDiscount(request)
    assert response.percentage      == 0
    assert response.value_in_cents  == 0