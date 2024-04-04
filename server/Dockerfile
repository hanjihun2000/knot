FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV port=8000
ENV ATLAS_URI=${ATLAS_URI}
EXPOSE ${port}

CMD [ "npm", "start" ]