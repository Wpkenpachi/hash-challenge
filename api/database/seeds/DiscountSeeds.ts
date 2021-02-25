import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { Discount } from "../../src/models/Discount";


const BLACK_FRIDAY_DATE = "11-25";

export class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
        .createQueryBuilder()
        .delete()
        .from(Discount)
        .execute();

        const discounts = [
            {
                title: "BLACK_FRIDAY",
                metadata: {
                    day: Number(BLACK_FRIDAY_DATE[0]),
                    month: BLACK_FRIDAY_DATE[1]
                }
            },
            {
                title: "BIRTHDAY_USER",
                metadata: {}
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