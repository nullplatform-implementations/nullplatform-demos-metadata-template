FROM node:lts AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./package.json ./
RUN npm install

COPY . .

FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app .

CMD ["npm", "run", "start"]
