FROM node
MAINTAINER Njáll Hilmar Hilmarsson <njall13@ru.is>
WORKDIR /

COPY build/package.json .
RUN npm install --silent
COPY build/ .

ENV NODE_ENV=production
ENV NODE_PATH=/
ENV PORT=8080

EXPOSE 8080

CMD npm run migratedb && node run.js
