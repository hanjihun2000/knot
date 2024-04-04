FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV port=8000
EXPOSE ${port}

CMD [ "npm", "start" ]