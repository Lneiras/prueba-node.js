FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npx", "tsx", "watch", "src/index.ts"]