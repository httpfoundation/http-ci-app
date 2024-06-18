# Use a Node.js base image
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY src/data/* /usr/src/app/dist

EXPOSE 3000

CMD [ "npm", "run", "start-build" ]