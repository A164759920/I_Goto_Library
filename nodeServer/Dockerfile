FROM node:16-alpine3.15

WORKDIR /app
COPY package.json .
RUN npm install
COPY . . 
EXPOSE 88
CMD [ "node", "index.js" ]