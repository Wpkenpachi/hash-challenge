import dotenv from "dotenv";
dotenv.config();
// Connect with database
import {createConnection, Connection, getConnection, createQueryBuilder, DeepPartial} from "typeorm";
import { Discount } from "../src/models/Discount";
import { User } from "../src/models/User";
import { Product } from "../src/models/Product";
import supertest from "supertest";
import { api } from "../src/api";
import moment from "moment";

import { client } from "../src/services/GrpcClient";
import grpc from "grpc";

let { BLACK_FRIDAY_DATE, PORT } = process.env;
const request = supertest.agent(api);
const splitted_date = BLACK_FRIDAY_DATE.split('-')

async function clearDatabase() {
    // Clear Products
    await getConnection()
        .createQueryBuilder()
        .from(Product, "product")
        .where("product.description = :description", { description: "MOCKED_PRODUCT_DESCRIPTION" }).delete();
    // Clear Users
    await User.delete({last_name: "MOCKED_LAST_NAME"});
}

async function databaseSetup() {
    // Ensure that default discount rules exists
    const hasBlackFridayDiscountRule    = await Discount.findOne({ title: "IS_BLACK_FRIDAY" });
    const hasBirthdayDiscountRule       = await Discount.findOne({ title: "IS_BIRTHDAY_USER" });
    if (!hasBlackFridayDiscountRule || !hasBirthdayDiscountRule) {
        await getConnection()
        .createQueryBuilder()
        .from(Discount, "discount")
        .where("discount.title = :title", { title: "IS_BLACK_FRIDAY" })
        .orWhere("discount.title = :title", { title: "IS_BIRTHDAY_USER" }).delete();
        await feedDiscount();
    }

    // Ensure that birthday user exists
    await User.delete({last_name: "MOCKED_LAST_NAME"});
    await feedUser();

    // Ensure that products exists
    const count_products = await getConnection()
    .createQueryBuilder()
    .from(Product, "product")
    .where("product.description = :description", { description: "MOCKED_PRODUCT_DESCRIPTION" }).getCount();
    if (count_products < 10) {
        await feedProduct();
    }
}

describe('Testing Product', () => {
    beforeAll(async () => {
        // Connecting to database
        await createConnection();
        // Setting up mocked data for dataase
        return await databaseSetup();
    });
    afterAll(async () => {
        return await clearDatabase();
    });

    /**
     * gRPC Connection
     */

    test('[1] Should Return connectivityState idle', () => {
        const connectivityState = client.getChannel().getConnectivityState(true);
        expect(connectivityState).toBe(grpc.connectivityState.IDLE);
        
    });

    /**
     * Happy Path
     */
    test('[2] Should Return Products Without Discount', async () => {
        const response = await request.get("/api/product");
        const { body: products, status } = response;
        expect(status).toBe(200);
        expect(products.length).toBeGreaterThan(0);
        if (products.length) {
            products.forEach((product: any) => {
                expect(product).toHaveProperty('id');
                expect(product).toHaveProperty('description');
                expect(product).toHaveProperty('price_in_cents');
                expect(product).not.toHaveProperty('discount');
            });
        }
        
    });
    
    test('[3] Should Return Products with max 10% off, sent Birthday User Id and Set Today as BlackFriday', async () => {
        // Setting Black Friday Discount for today
        const last_metadata = await Discount.findOne({ title: "IS_BLACK_FRIDAY" });

        const metadata = {
            type: "PERCENTAGE",
            percentage: 5,
            day: String(splitted_date[0]),
            month: String(splitted_date[1])
        };

        const new_metadata = {
            percentage: last_metadata.metadata.percentage,
            day: moment().format('DD'),
            month: moment().format('MM')
        };

        await Discount.update({ title: "IS_BLACK_FRIDAY" }, {
           metadata: new_metadata
        });
        
        try {
            const birthdayUser: User = await User.findOne({ first_name: "MOCKED_BIRTHDAY_USER" });
            const response = await request.get("/api/product").set({"X-USER-ID": Number(birthdayUser.id)});
    
            const { body: products, status } = response;
    
            expect(status).toBe(200);
            expect(products.length).toBeGreaterThan(0);
            if (products.length) {
                products.forEach((product: any) => {
                    expect(product).toHaveProperty('id');
                    expect(product).toHaveProperty('description');
                    expect(product).toHaveProperty('price_in_cents');
                    expect(product).toHaveProperty('discount');
                    expect(product.discount.percentage).toBeLessThanOrEqual(10);
                    expect(product.discount.value_in_cents).toBeGreaterThan(0);
                });
            }
    
            await Discount.update({ title: "IS_BLACK_FRIDAY" }, {
                metadata
            });
        } catch (error) {
    
            await Discount.update({ title: "IS_BLACK_FRIDAY" }, {
                metadata
            });
        }
        
    });

    test('[4] Should Return Products With Birthday Discount', async () => {
        const birthdayUser: User = await User.findOne({ first_name: "MOCKED_BIRTHDAY_USER" });
        const birthdayDiscount: Discount = await Discount.findOne({ title: "IS_BIRTHDAY_USER" });
        const response = await request.get("/api/product").set({"X-USER-ID": Number(birthdayUser.id)});
        const { body: products, status } = response;
        expect(status).toBe(200);
        expect(products.length).toBeGreaterThan(0);
        if (products.length) {
            products.forEach((product: any) => {
                expect(product).toHaveProperty('id');
                expect(product).toHaveProperty('description');
                expect(product).toHaveProperty('price_in_cents');
                expect(product).toHaveProperty('discount');
                expect(product.discount.percentage).toBe(birthdayDiscount.metadata.percentage);
                expect(product.discount.value_in_cents).toBeGreaterThan(0);
            });
        }
        
    });

    test('[5] Should Return Products Without Discount, sent Normal User in Normal Day', async () => {
        const birthdayUser: User = await User.findOne({ first_name: "NORMAL_USER_1" });
        const response = await request.get("/api/product").set({"X-USER-ID": Number(birthdayUser.id)});
        const { body: products, status } = response;
        expect(status).toBe(200);
        expect(products.length).toBeGreaterThan(0);
        if (products.length) {
            products.forEach((product: any) => {
                expect(product).toHaveProperty('id');
                expect(product).toHaveProperty('description');
                expect(product).toHaveProperty('price_in_cents');
                expect('discount' in product).toBeFalsy();
            });
        }
        
    });

    /**
     * Negative Response with Valid Optional Parameters
     */
    test('[6] Should Return Products Without Discount, sent Nonexistent User', async () => {
        const getMaxUserId = async (param: any = null): Promise<any> => {
            const result = await createQueryBuilder("User").select("MAX(User.id)", "max").getRawOne();
            return result.max;
        };

        let non_existent_user_id = await getMaxUserId();
        non_existent_user_id += 1;

        const response = await request.get("/api/product").set({"X-USER-ID": Number(non_existent_user_id)});
        const { body: products, status } = response;
        expect(status).toBe(200);
        expect(products.length).toBeGreaterThan(0);
        if (products.length) {
            products.forEach((product: any) => {
                expect(product).toHaveProperty('id');
                expect(product).toHaveProperty('description');
                expect(product).toHaveProperty('price_in_cents');
                expect('discount' in product).toBeFalsy();
            });
        }
    });

    /**
     * Negative Response with Invalid Optional Parameters
     */
    test('[7] Should Return Error, sent Invalid X-USER-ID input', async () => {
        const response = await request.get("/api/product").set("X-USER-ID", "S");
        const { body, status } = response;
        expect(status).toBe(400);
        expect(body).toEqual([{isInt: "x-user-id must be an integer number"}]);
    });
});

async function feedDiscount() {
    const discounts = [{
        title: "IS_BLACK_FRIDAY",
        metadata: {
            percentage: 5,
            day: Number(splitted_date[0]),
            month: Number(splitted_date[1])
        }},
        {
            title: "IS_BIRTHDAY_USER",
            metadata: {
                percentage: 10
            }
        }];

    return Promise.all(discounts.map( async discount => {
        let new_discount        = new Discount();
        new_discount.title      = discount.title;
        new_discount.metadata   = discount.metadata;
        await new_discount.save();
    }));
}

async function feedUser() {
    const users = [
        {
            first_name: "MOCKED_BIRTHDAY_USER",
            last_name: "MOCKED_LAST_NAME",
            date_of_birth: new Date(moment().format('YYYY-MM-DD 00:10:00'))
        },
        {
            first_name: "NORMAL_USER_1",
            last_name: "MOCKED_LAST_NAME",
            date_of_birth: new Date(moment().subtract(20, 'y').add(10, 'd').format('YYYY-MM-DD 00:10:00'))
        },
        {
            first_name: "NORMAL_USER_2",
            last_name: "MOCKED_LAST_NAME",
            date_of_birth: new Date(moment().subtract(20, 'y').subtract(10, 'd').format('YYYY-MM-DD 00:10:00'))
        },
        {
            first_name: "NORMAL_USER_3",
            last_name: "MOCKED_LAST_NAME",
            date_of_birth: new Date(moment([ 1996, Number(splitted_date[0])-1, Number(splitted_date[1]) ]).format('YYYY-MM-DD 00:10:00'))
        }
    ]
    
    await getConnection().createQueryBuilder()
    .insert()
    .into(User)
    .values(users)
    .execute();
}

async function feedProduct() {
    const products: any[] = [{
        price_in_cents: 7972,
        title: "Port - 74 Brights",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 6788,
        title: "Wine - Maipo Valle Cabernet",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 1851,
        title: "Bols Melon Liqueur",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 7766,
        title: "Wine - Red, Lurton Merlot De",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 9081,
        title: "Soup - Campbells Mac N Cheese",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 4545,
        title: "Pastry - Trippleberry Muffin - Mini",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 1116,
        title: "Rhubarb",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 9366,
        title: "Halibut - Fletches",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 5472,
        title: "Bacardi Mojito",
        description: "MOCKED_PRODUCT_DESCRIPTION"
      }, {
        price_in_cents: 4404,
        title: "Sausage - Andouille",
        description: "MOCKED_PRODUCT_DESCRIPTION"
    }];

    await getConnection().createQueryBuilder()
        .insert()
        .into(Product)
        .values(products)
        .execute();
}