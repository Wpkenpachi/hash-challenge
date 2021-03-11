import { createConnection } from "typeorm";

createConnection().then(async () => {
  console.log('Database Connected!');
});