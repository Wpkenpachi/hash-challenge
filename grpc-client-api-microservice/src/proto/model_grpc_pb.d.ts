// package: 
// file: model.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as model_pb from "./model_pb";

interface IIndividualProductDiscountService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    fetchDiscount: IIndividualProductDiscountService_IFetchDiscount;
}

interface IIndividualProductDiscountService_IFetchDiscount extends grpc.MethodDefinition<model_pb.GetDiscountRequest, model_pb.GetDiscountResponse> {
    path: "/IndividualProductDiscount/FetchDiscount";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<model_pb.GetDiscountRequest>;
    requestDeserialize: grpc.deserialize<model_pb.GetDiscountRequest>;
    responseSerialize: grpc.serialize<model_pb.GetDiscountResponse>;
    responseDeserialize: grpc.deserialize<model_pb.GetDiscountResponse>;
}

export const IndividualProductDiscountService: IIndividualProductDiscountService;

export interface IIndividualProductDiscountServer {
    fetchDiscount: grpc.handleUnaryCall<model_pb.GetDiscountRequest, model_pb.GetDiscountResponse>;
}

export interface IIndividualProductDiscountClient {
    fetchDiscount(request: model_pb.GetDiscountRequest, callback: (error: grpc.ServiceError | null, response: model_pb.GetDiscountResponse) => void): grpc.ClientUnaryCall;
    fetchDiscount(request: model_pb.GetDiscountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.GetDiscountResponse) => void): grpc.ClientUnaryCall;
    fetchDiscount(request: model_pb.GetDiscountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.GetDiscountResponse) => void): grpc.ClientUnaryCall;
}

export class IndividualProductDiscountClient extends grpc.Client implements IIndividualProductDiscountClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public fetchDiscount(request: model_pb.GetDiscountRequest, callback: (error: grpc.ServiceError | null, response: model_pb.GetDiscountResponse) => void): grpc.ClientUnaryCall;
    public fetchDiscount(request: model_pb.GetDiscountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: model_pb.GetDiscountResponse) => void): grpc.ClientUnaryCall;
    public fetchDiscount(request: model_pb.GetDiscountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: model_pb.GetDiscountResponse) => void): grpc.ClientUnaryCall;
}
