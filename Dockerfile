FROM node:8.9.1 
LABEL maintainer Daniel Olivares "fuzzoli87@gmail.com"

RUN mkdir /home/app

WORKDIR /home/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
