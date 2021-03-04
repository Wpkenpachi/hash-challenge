import grpc from "grpc";
import { GetDiscountRequest } from "../proto/model_pb";
import { IndividualProductDiscountClient } from "../proto/model_grpc_pb";

export const client = new IndividualProductDiscountClient(`${process.env.GRPC_SERVER_URI}:${process.env.GRPC_SERVER_PORT}`, grpc.credentials.createInsecure());

export async function grpcGetDiscount(product_id: number, user_id: number | undefined) {

    const request: GetDiscountRequest = new GetDiscountRequest();
    request.setProductId(product_id);
    request.setUserId(user_id);

    return new Promise((resolve, reject) => {
        client.fetchDiscount(request, (err, response) => {
            if (err) {
                reject(err);
            } else {
                const payload = response.toObject(false);
                resolve(payload);
            }
        });
    });
}
