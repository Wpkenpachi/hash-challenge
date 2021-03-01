import { User } from "../models/User";
import { Product } from "../models/Product";
import { grpcGetDiscount } from "../services/GrpcClient";
import { GetProductReseponse } from "../request/interfaces/Product";

export async function getProductsWithDiscount(user_id: number | undefined): Promise<GetProductReseponse[]|Product[]> {
    const user = user_id ? await User.findOne(user_id) : null;
    const products = await Product.find({});
    if (!user) {
        return new Promise((resolve) => {
            resolve(products);
        });
    }
    else {
        let results: any[] = [];
        let counter = 0;
        const loop = async (product: Product, metadata: any) => {
            const length: number = products.length - 1;
            if (counter > length) return;
            try {
                const discount: any = await grpcGetDiscount(product.id, metadata.id);
                if (discount && discount.percentage) {
                    const _product = {...product, discount: {percentage: discount.percentage, value_in_cents: discount.valueInCents}};
                    results.push(_product);
                } else {
                    results.push(product);
                }
                counter += 1;
                await loop(products[counter], metadata);
            } catch (error) {
                console.log(error);
                results.push(products[counter]);
                counter += 1;
                await loop(products[counter], metadata);
            }
        };
        await loop(products[counter], user);
        return new Promise((resolve) => {
            resolve(results);
        });
    }
}

// export async function getProductsWithoutDiscount(): Promise<GetProductReseponse[]> {
//     const products = await Product.find({});
//     return products_response(products);
// }