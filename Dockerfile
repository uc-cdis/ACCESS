FROM node:8.15-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
CMD npm start
