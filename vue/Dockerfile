FROM node:16-alpine3.15

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install
RUN npm install @vue/cli -g

COPY . .

EXPOSE 8080
CMD ["npm", "run", "serve"]