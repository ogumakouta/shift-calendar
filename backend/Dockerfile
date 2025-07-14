FROM node:24.4.0-alpine AS development

WORKDIR /app

RUN apk add bash
RUN npm install -g @nestjs/cli prisma

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]