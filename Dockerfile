FROM node:12.19.0-buster-slim

RUN mkdir /code/
WORKDIR /code/
COPY . /code/

RUN cd /code
RUN npm install