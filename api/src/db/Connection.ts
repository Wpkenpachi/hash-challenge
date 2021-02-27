import {createConnection, Connection} from "typeorm";

createConnection().then(async (res: Connection) => {
    console.log('Database Connected!');
    // await res.runMigrations();
});
