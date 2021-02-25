import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { User } from "../../src/models/User";
import moment from "moment";

const BLACK_FRIDAY_DATE = "11-25";

export class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
        .createQueryBuilder()
        .delete()
        .from(User)
        .execute();

        const black_friday_date = [...BLACK_FRIDAY_DATE.split('-')];
        const users = [
            {
                first_name: "Birthday User",
                last_name: "LAST_SEED_NAME",
                date_of_birth: moment().subtract(20, 'y').format('YYYY-MM-DD')
            },
            {
                first_name: "Normal User",
                last_name: "LAST_SEED_NAME",
                date_of_birth: moment().subtract(20, 'y').add(10, 'd').format('YYYY-MM-DD')
            },
            {
                first_name: "Normal User",
                last_name: "LAST_SEED_NAME",
                date_of_birth: moment().subtract(20, 'y').subtract(10, 'd').format('YYYY-MM-DD')
            },
            {
                first_name: "Normal User",
                last_name: "LAST_SEED_NAME",
                date_of_birth: moment([ 1996, Number(black_friday_date[0])-1, Number(black_friday_date[1]) ]).format('YYYY-MM-DD')
            }
        ]

        await connection
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(users)
          .execute()
      }
}