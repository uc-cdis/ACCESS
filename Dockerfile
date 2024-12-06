FROM quay.io/cdis/nodejs-base:master
WORKDIR /app
RUN yum update -y && yum install -y nodejs npm
RUN chown -R gen3: /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
CMD npm start
