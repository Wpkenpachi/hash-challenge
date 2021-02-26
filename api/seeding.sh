#!/bin/bash
echo "DATABASE SEEDING"
echo "Generating Migration Table"
ts-node ./node_modules/.bin/typeorm migration:run
ts-node ./node_modules/.bin/typeorm migration:generate -n tables
echo "Running Migrations SQL"
ts-node ./node_modules/.bin/typeorm schema:sync

echo "Configuring Seeding Files"
ts-node ./node_modules/typeorm-seeding/dist/cli.js config
echo "Running Seeders..."
ts-node ./node_modules/typeorm-seeding/dist/cli.js seed