FROM 707767160287.dkr.ecr.us-east-1.amazonaws.com/gen3/nodejs-base:master
WORKDIR /app
RUN yum update -y && \
    yum install -y nodejs npm
RUN chown -R gen3: /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
CMD npm start
