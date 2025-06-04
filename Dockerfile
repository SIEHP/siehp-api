FROM node:21-alpine
WORKDIR /usr/src/siehp-api
COPY package*.json ./
COPY . ./
EXPOSE 8000
ENV WAIT_VERSION 2.9.0
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

USER node
