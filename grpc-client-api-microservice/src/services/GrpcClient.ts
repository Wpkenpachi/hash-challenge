import { GetDiscountRequest } from "../proto/model_pb"
import { IndividualProductDiscountClient } from "../proto/model_grpc_pb"
import grpc from "grpc"

export const client = new IndividualProductDiscountClient(`${process.env.GRPC_SERVER_URI}:${process.env.GRPC_SERVER_PORT}`, grpc.credentials.createInsecure())

export async function grpcGetDiscount(productId: number, userId: number | undefined) {
  const request: GetDiscountRequest = new GetDiscountRequest()
  request.setProductId(productId)
  request.setUserId(userId)

  return new Promise((resolve, reject) => {
    client.fetchDiscount(request, (err: any, response: any) => {
      if (err) {
        reject(err)
      } else {
        const payload = response.toObject(false)
        resolve(payload)
      }
    })
  })
}
