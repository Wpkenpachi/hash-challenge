import { IsOptional, IsInt } from "class-validator";
import { Expose } from "class-transformer";

export class GetProductHeaderRequest {
    @IsOptional()
    @Expose()
    @IsInt()
    "x-user-id": number;
}

export interface GetProductReseponse {
    id: number;
    price_in_cents: number;
    title: string;
    description: string;
    discount: {
        percentage: number,
        value_in_cents: number
    }
}