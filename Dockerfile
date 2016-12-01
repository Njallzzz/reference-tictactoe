FROM node
MAINTAINER Njáll Hilmar Hilmarsson <njall13@ru.is>
WORKDIR /

COPY package.json .
COPY build/client ./client
COPY build/server ./server
COPY build/static ./static
COPY build/run.js ./run.js
RUN npm install --silent

ENV NODE_ENV=production
ENV NODE_PATH=/
ENV PORT=8080

EXPOSE 8080
