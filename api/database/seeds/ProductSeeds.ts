import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';
import { Product } from "../../src/models/Product";

export class CreateProducts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
        .createQueryBuilder()
        .delete()
        .from(Product)
        .execute();

        const products: any[] = [{
            price_in_cents: 7972,
            title: "Port - 74 Brights",
            description: "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis."
          }, {
            price_in_cents: 6788,
            title: "Wine - Maipo Valle Cabernet",
            description: "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
          }, {
            price_in_cents: 1851,
            title: "Bols Melon Liqueur",
            description: "In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.",
          }, {
            price_in_cents: 7766,
            title: "Wine - Red, Lurton Merlot De",
            description: "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
          }, {
            price_in_cents: 9081,
            title: "Soup - Campbells Mac N Cheese",
            description: "In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
          }, {
            price_in_cents: 4545,
            title: "Pastry - Trippleberry Muffin - Mini",
            description: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
          }, {
            price_in_cents: 1116,
            title: "Rhubarb",
            description: "Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
          }, {
            price_in_cents: 9366,
            title: "Halibut - Fletches",
            description: "In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
          }, {
            price_in_cents: 5472,
            title: "Bacardi Mojito",
            description: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
          }, {
            price_in_cents: 4404,
            title: "Sausage - Andouille",
            description: "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
          }];

        const new_products = products.map( _ => {
            const product          = new Product();
            product.title          = _.title;
            product.description    = _.description;
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