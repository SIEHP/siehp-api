FROM node:18-alpine
WORKDIR /usr/src/siehp-api
COPY package*.json ./
COPY . ./
EXPOSE 3000