import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { Product } from '../../src/models/Product';

export class CreateProducts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .delete()
      .from(Product)
      .execute();

    const products: any[] = [{
      price_in_cents: 7972,
      title: 'Port - 74 Brights',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 6788,
      title: 'Wine - Maipo Valle Cabernet',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 1851,
      title: 'Bols Melon Liqueur',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 7766,
      title: 'Wine - Red, Lurton Merlot De',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 9081,
      title: 'Soup - Campbells Mac N Cheese',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 4545,
      title: 'Pastry - Trippleberry Muffin - Mini',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 1116,
      title: 'Rhubarb',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 9366,
      title: 'Halibut - Fletches',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 5472,
      title: 'Bacardi Mojito',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }, {
      price_in_cents: 4404,
      title: 'Sausage - Andouille',
      description: 'MOCKED_PRODUCT_DESCRIPTION'
    }];

    const new_products = products.map(_ => {
      const product = new Product();
      product.title = _.title;
      product.description = _.description;
      product.price_in_cents = _.price_in_cents;
      product.save();
      return product;
    });

    await connection
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(new_products)
      .execute()
  }

}