import { Router, Request, Response } from 'express'
import { headerValidation } from '../request/middlewares/validator'
import { GetProductHeaderRequest, GetProductReseponse } from '../request/interfaces/Product'
import { getProductsWithDiscount } from '../business/GetDiscount'
import { Product } from '../models/Product'
const route = Router()

route.get('/product', headerValidation(GetProductHeaderRequest), async (req: Request, res: Response) => {
  const userId: number | undefined = req.header('x-user-id') ? Number(req.header('x-user-id')) : undefined
  const response: GetProductReseponse[] | Product[] = await getProductsWithDiscount(userId)
  res.json(response)
})

export default route