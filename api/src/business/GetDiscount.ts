import { User } from "../models/User";
import { Product } from "../models/Product";
import { grpcGetDiscount } from "../services/GrpcClient";
import { GetProductReseponse } from "../request/interfaces/Product";

const products_response = (_products: Product[]): GetProductReseponse[] => {
    return _products.map( product => {
        return {
            ...product,
            discount: {
                percentage: 0.0,
                value_in_cents: 0
            }
        }
    });
}

export async function getProductsWithDiscount(user_id: number): Promise<GetProductReseponse[]> {
    const user = await User.findOne(user_id);
    const products = await Product.find({});    

    if (!user) {
        return new Promise((resolve) => {
            resolve(products_response(products));
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
                const _product = {...product, discount: {percentage: discount.percentage, value_in_cents: discount.valueInCents}};
                results.push(_product);
                counter += 1;
                await loop(products[counter], metadata);
            } catch (error) {
                console.log(error);
                results = products_response(products);
            }
        };
        await loop(products[counter], user);
        return new Promise((resolve) => {
            resolve(results);
        });
    }
}

export async function getProductsWithoutDiscount(): Promise<GetProductReseponse[]> {
    const products = await Product.find({});
    return products_response(products);
}