FROM node:24.4.0-alpine

WORKDIR /app
RUN apk add bash && \
    npm i -g @nestjs/cli

CMD ["npm", "run", "start:dev"]