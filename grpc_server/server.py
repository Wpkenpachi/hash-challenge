import os
from dotenv import load_dotenv
load_dotenv()

from app.repositories import UserRepository
from app.services import DiscountService

import grpc
from concurrent import futures

from proto import model_pb2
from proto import model_pb2_grpc

class IndividualProductDiscountServicer(model_pb2_grpc.IndividualProductDiscountServicer):
    def FetchDiscount(self, request, context):
        response = model_pb2.GetDiscountResponse()
        discount = DiscountService.getDiscount(request.product_id, request.user_id)
        response.percentage = float(discount['percentage'])
        response.value_in_cents = int(discount['value_in_cents'])
        return response

def main():
    port = os.getenv('GRPC_SERVER_PORT')
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    model_pb2_grpc.add_IndividualProductDiscountServicer_to_server(IndividualProductDiscountServicer(), server)
    print('Starting server. Listening on port 50052.')
    server.add_insecure_port(f'[::]:{port}')
    server.start()
    server.wait_for_termination()
    
if __name__ == "__main__":
    main()