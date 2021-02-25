import { Router, Request, Response } from "express";
const route = Router();

route.get("/product", (req: Request, res: Response) => {
    res.json({});
});

export default route;