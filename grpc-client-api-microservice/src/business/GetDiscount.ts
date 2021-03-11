import { User } from "../models/User"
import { Product } from "../models/Product"
import { grpcGetDiscount } from "../services/GrpcClient"
import { GetProductReseponse } from "../request/interfaces/Product"

export async function getProductsWithDiscount(userId: number | undefined): Promise<GetProductReseponse[] | Product[]> {
  const user: User | undefined = userId ? await User.findOne(userId) : undefined
  const products: Product[] = await Product.find({})
  const results: any[] = []
  let counter = 0
  const loop = async (product: Product, _user: any) => {
    const length: number = products.length - 1
    if (counter > length) return
    try {
      const userId: number | undefined = _user ? _user.id : undefined
      const discount: any = await grpcGetDiscount(product.id, userId)
      if (discount && discount.percentage && discount.valueInCents) {
        const _product: GetProductReseponse = { ...product, discount: { percentage: discount.percentage, value_in_cents: discount.valueInCents } }
        results.push(_product)
      } else {
        results.push(product)
      }
      counter += 1
      await loop(products[counter], _user)
    } catch (error) {
      results.push(products[counter])
      counter += 1
      await loop(products[counter], _user)
    }
  }
  await loop(products[counter], user)
  return new Promise((resolve) => {
    resolve(results)
  })
}