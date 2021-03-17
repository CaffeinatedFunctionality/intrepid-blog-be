FROM node:12

WORKDIR usr/app

ENV NODE_PATH=./src

COPY .env .
COPY .babelrc .
COPY prisma ./prisma/
RUN npm install nodemon pm2 -g

COPY package*.json ./
RUN npm i

COPY ./src ./src
RUN npm run build

EXPOSE 8821

CMD ["npm", "run", "start-local"]
