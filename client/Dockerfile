FROM node:alpine

WORKDIR /app
COPY package.json .

# install dependecies
# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
# RUN cnpm install
RUN npm install
COPY . .

CMD [ "npm","run","dev" ]