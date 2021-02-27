import { Router, Request, Response } from "express";
import { headerValidation } from "../request/middlewares/validator";
import { GetProductHeaderRequest, GetProductReseponse } from "../request/interfaces/Product";
import { getProductsWithDiscount, getProductsWithoutDiscount } from "../business/GetDiscount";
const route = Router();

route.get("/product", headerValidation(GetProductHeaderRequest), async (req: Request, res: Response) => {
    if (req.header('x-user-id')) {
        const user_id: number = Number(req.header("x-user-id"));
        const response: GetProductReseponse[] = await getProductsWithDiscount(user_id);
        res.json(response);
    } else {
        const response: GetProductReseponse[] = await getProductsWithoutDiscount();
        res.json(response);
    }
});

export default route;