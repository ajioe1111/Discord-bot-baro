FROM node:14.15.4-buster

ENV TZ='Europe/Moscow'

WORKDIR /barobot
COPY . .

RUN npm install

ENTRYPOINT node bot.js