FROM node:24.4.0-alpine AS development

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apk add bash

CMD ["npm", "run", "dev"]