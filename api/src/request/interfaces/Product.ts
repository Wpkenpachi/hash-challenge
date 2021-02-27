import { IsOptional, IsInt } from "class-validator";
import { Expose } from "class-transformer";

export class GetProductHeaderRequest {
    @IsOptional()
    @Expose()
    @IsInt()
    "X-USER-ID": Number;
}

export interface GetProductReseponse {
    id: number;
    price_in_cents: number;
    title: string;
    description: string;
    discount: {
        percentage: number,
        valueInCents: number
    }
}