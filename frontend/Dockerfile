FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash

RUN npm cache clean --force

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
