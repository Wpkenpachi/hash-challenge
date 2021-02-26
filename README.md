# Hash Challenge
[Challenge Description](https://github.com/hashlab/hiring/blob/master/challenges/pt-br/back-challenge.md)

## Run Setup
    $ docker-compose up -d --build

> This command will setup Postgres database, gRPC client (Node Api) and gRPC server (Python Api)

## Adicional Setup Config
    $ docker exec -it node_client bash ./run.sh

> This command will create and run database migrations and seed database with mocked data

## 
