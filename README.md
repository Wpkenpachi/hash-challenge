# Hash Challenge
[Challenge Description](https://github.com/hashlab/hiring/blob/master/challenges/pt-br/back-challenge.md)

## Giving permission to run file
    $ chmod +x run

## Runnig Up Docker-Compose
    $ sh run up
> This command will setup Postgres database, gRPC client (Node Api) and gRPC server (Python Api)

## Stopping Docker-Compose and removing images and containers
    $ sh run down
> This command will down Postgres database, gRPC client (Node Api) and gRPC server (Python Api)


## Running tests
    $ sh run tests

> This command will run python gRPC server tests and node gRPC client tests (Obs: docker-compose need to be running `sh run up`)

## Database Schema
![database-schema](database-schema.png)

## How Discount is Structured
All Discount types will be recorded on database with an `id`, `title` (the name and type of discount) and a `metadata`.
The metadata will have all required data to apply product discounts. The required metadata properties is
the `percentage` or/and `value_in_cents` and `type` (to set if discount is by percentage or value_in_cents), all aditional properties is specific data for a specific discount type.

## How Discount Works
For every each discount record, there's a method on gRPC Python server to handle it. For each
discount to be created needs one handler method with the same name as `title` field. e.g:
![grpc-service-discount-methods](grpc-service-discount-methods.png)

## Endpoints
<b>Base Url:</b> http://localhost:8080
<table>
    <thead>
        <tr>
            <th> Route </th>
            <th> Header </th>
            <th> Query </th>
            <th> Body </th>
            <th> Response </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> /product </td>
            <td>  </td>
            <td> </td>
            <td> </td>
            <td>
                <pre>
                [
                    {
                        "id": 1,
                        "price_in_cents": 7972,
                        "title": "Port - 74 Brights",
                        "description": "description"
                    },
                    ...
                ]
                </pre>
            </td>
        </tr>
        <tr>
            <td> /product </td>
            <td> X-USER-ID </td>
            <td> </td>
            <td> </td>
            <td>
                <pre>
                [
                    {
                        "id": 1,
                        "price_in_cents": 7972,
                        "title": "Port - 74 Brights",
                        "description": "description",
                        "discount": {
                            "percentage": 5,
                            "value_in_cents": 398
                        }
                    },
                    ...
                ]
                </pre>
            </td>
        </tr>
    </tbody>
</table>

# Test Helper Scripts
For docker-compose handling, we have `run` file.
>   $ sh run _OPTION_

```bash
up             run docker-compose up -d --build
down           down docker-compose and remove containers, networks, images and volumes
tests          run gRPC Python Server tests and gRPC Node Client tests
downserver     down gRPC Python Server
```

For test help, we have `get` file. Will be accessed by docker commands
> $ docker exec -it _python_server_ sh -c "python3 get _ARG_"
```bash
Valid arguments:
buser       Will return a valid birthday user from database.
nuser       Will return a valid normal user (not in birthday) from database.
bfriday     Will set black friday for today on database.
reset       Will reset black friday day on database.
```

# Folder and File Tree ( only important files )
<pre>
📦desafio_hash
 ┣ 📂api                                    # GRPC NODE CLIENT ( Typescript + Node + Typeorm )
 ┃ ┣ 📂database
 ┃ ┃ ┣ 📂migrations
 ┃ ┃ ┗ 📂seeds
 ┃ ┃ ┃ ┣ 📜DiscountSeeds.ts
 ┃ ┃ ┃ ┣ 📜ProductSeeds.ts
 ┃ ┃ ┃ ┗ 📜UserSeeds.ts
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂business
 ┃ ┃ ┃ ┗ 📜GetDiscount.ts
 ┃ ┃ ┣ 📂db
 ┃ ┃ ┃ ┗ 📜Connection.ts                    # Database Connection
 ┃ ┃ ┣ 📂models
 ┃ ┃ ┃ ┣ 📜Discount.ts
 ┃ ┃ ┃ ┣ 📜Product.ts
 ┃ ┃ ┃ ┗ 📜User.ts
 ┃ ┃ ┣ 📂proto                              # gRPC Proto and Generated Files
 ┃ ┃ ┃ ┣ 📜model.proto
 ┃ ┃ ┃ ┣ 📜model_grpc_pb.d.ts
 ┃ ┃ ┃ ┣ 📜model_grpc_pb.js
 ┃ ┃ ┃ ┣ 📜model_pb.d.ts
 ┃ ┃ ┃ ┣ 📜model_pb.js
 ┃ ┃ ┃ ┣ 📜model_pb2.py
 ┃ ┃ ┃ ┗ 📜model_pb2_grpc.py
 ┃ ┃ ┣ 📂request
 ┃ ┃ ┃ ┣ 📂interfaces
 ┃ ┃ ┃ ┃ ┗ 📜Product.ts
 ┃ ┃ ┃ ┗ 📂middlewares
 ┃ ┃ ┃ ┃ ┗ 📜validator.ts
 ┃ ┃ ┣ 📂routes
 ┃ ┃ ┃ ┗ 📜index.ts                         # API Expose Routes
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┗ 📜GrpcClient.ts                    # gRPC Client Service
 ┃ ┃ ┣ 📂utils
 ┃ ┃ ┣ 📜api.ts
 ┃ ┃ ┗ 📜server.ts                          # Server Listening Entrypoint
 ┃ ┣ 📂tests                                # API tests
 ┃ ┃ ┗ 📜GetDiscount.test.ts
 ┃ ┣ 📜Dockerfile
 ┃ ┣ 📜setup                                # Bash script to create and populate database
 ┣ 📂grpc_server                            # GRPC PYTHON SERVER ( Python + peewee orm )
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📂db
 ┃ ┃ ┃ ┗ 📜database.py                      # Database Connection
 ┃ ┃ ┣ 📂models
 ┃ ┃ ┃ ┣ 📜discount.py
 ┃ ┃ ┃ ┣ 📜model.py
 ┃ ┃ ┃ ┣ 📜product.py
 ┃ ┃ ┃ ┗ 📜user.py
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┣ 📜check_discount_rule_service.py
 ┃ ┃ ┃ ┗ 📜discount_service.py
 ┃ ┃ ┣ 📜interfaces.py
 ┃ ┃ ┗ 📜utils.py
 ┃ ┣ 📂proto                                # gRPC Proto and Generated Files
 ┃ ┃ ┃ ┣ 📜model_pb2.cpython-38.pyc
 ┃ ┃ ┃ ┗ 📜model_pb2_grpc.cpython-38.pyc
 ┃ ┃ ┣ 📜model.proto
 ┃ ┃ ┣ 📜model_pb2.py
 ┃ ┃ ┗ 📜model_pb2_grpc.py
 ┃ ┣ 📂tests                                # gRPC Tests
 ┃ ┃ ┣ 📜test_grpc_server.py
 ┃ ┃ ┗ 📜test_utils.py
 ┃ ┣ 📜Dockerfile
 ┃ ┣ 📜get                                  # Test helper script
 ┃ ┣ 📜protobuild                           # Bash file that will generate gRPC proto bundles
 ┃ ┣ 📜requirements.txt
 ┃ ┗ 📜server.py
 ┣ 📜docker-compose.yml
 ┗ 📜run                                    # Bash script to deploy docker-compose
</pre>