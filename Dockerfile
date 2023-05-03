FROM node:14

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm ci
# RUN npx prisma generate
RUN npm run build

ARG NODE_ENV
ARG APP_VERSION

ENV NODE_ENV=$NODE_ENV
ENV APP_VERSION=$APP_VERSION

EXPOSE 3000

# CMD npx prisma migrate deploy && npm start

