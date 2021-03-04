// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var model_pb = require('./model_pb.js');

function serialize_GetDiscountRequest(arg) {
  if (!(arg instanceof model_pb.GetDiscountRequest)) {
    throw new Error('Expected argument of type GetDiscountRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetDiscountRequest(buffer_arg) {
  return model_pb.GetDiscountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetDiscountResponse(arg) {
  if (!(arg instanceof model_pb.GetDiscountResponse)) {
    throw new Error('Expected argument of type GetDiscountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetDiscountResponse(buffer_arg) {
  return model_pb.GetDiscountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var IndividualProductDiscountService = exports.IndividualProductDiscountService = {
  fetchDiscount: {
    path: '/IndividualProductDiscount/FetchDiscount',
    requestStream: false,
    responseStream: false,
    requestType: model_pb.GetDiscountRequest,
    responseType: model_pb.GetDiscountResponse,
    requestSerialize: serialize_GetDiscountRequest,
    requestDeserialize: deserialize_GetDiscountRequest,
    responseSerialize: serialize_GetDiscountResponse,
    responseDeserialize: deserialize_GetDiscountResponse,
  },
};

exports.IndividualProductDiscountClient = grpc.makeGenericClientConstructor(IndividualProductDiscountService);
