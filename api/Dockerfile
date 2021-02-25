# Running Application
FROM node:10.19.0
WORKDIR /usr/app
COPY package*.json ./

RUN npm install typescript typeorm ts-node -g
RUN npm install

# Copy app source
COPY . .
COPY ormconfig.prod.json ./ormconfig.json

RUN chmod +x run.sh

EXPOSE 8080
CMD [ "npm", "start" ]