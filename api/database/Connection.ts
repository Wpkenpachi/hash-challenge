import {createConnection, Connection} from "typeorm";

createConnection().then(res => {
    console.log('Database Connected!')
    res.runMigrations();
});
