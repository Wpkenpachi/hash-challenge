# Hash Challenge
[Challenge Description](https://github.com/hashlab/hiring/blob/master/challenges/pt-br/back-challenge.md)

## Giving permissions to running files
    $ chmox +x run

## Runnig Up Docker-Compose
    $ sh run up
> This command will setup Postgres database, gRPC client (Node Api) and gRPC server (Python Api)

## Stoping Docker-Compose and removing images and containers
    $ sh run down
> This command will down Postgres database, gRPC client (Node Api) and gRPC server (Python Api)


## Running tests
    $ sh run tests

> This command will run python gRPC server tests and node gRPC client tests

## 
