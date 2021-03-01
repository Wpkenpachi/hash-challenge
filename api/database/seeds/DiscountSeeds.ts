import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { Discount } from "../../src/models/Discount";
import dotenv from "dotenv";
dotenv.config();

const { BLACK_FRIDAY_DATE } = process.env;

export class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
        .createQueryBuilder()
        .delete()
        .from(Discount)
        .execute();

        const splitted_date = BLACK_FRIDAY_DATE.split('-')

        const discounts = [
            {
                title: "IS_BLACK_FRIDAY",
                metadata: {
                    type: "PERCENTAGE",
                    percentage: 10,
                    day: String(splitted_date[0]),
                    month: String(splitted_date[1])
                }
            },
            {
                title: "IS_BIRTHDAY_USER",
                metadata: {
                    type: "PERCENTAGE",
                    percentage: 5
                }
            }
        ];

        await connection
          .createQueryBuilder()
          .insert()
          .into(Discount)
          .values(discounts)
          .execute()
      }
}