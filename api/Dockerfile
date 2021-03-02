# Running Application
FROM node:10.19.0
WORKDIR /usr/app
COPY package*.json ./

RUN npm install typescript typeorm ts-node -g
RUN npm install

# Copy app source
COPY . .
COPY ormconfig.prod.json ./ormconfig.json
COPY .env.prod .env

RUN chmod +x setup
RUN yarn run grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./src/proto \
    --grpc_out=./src/proto \
    --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
    -I ./src/proto \
    ./src/proto/*.proto

RUN yarn run grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=./src/proto \
    -I ./src/proto \
    ./src/proto/*.proto

EXPOSE 8080
CMD [ "sh", "setup"]