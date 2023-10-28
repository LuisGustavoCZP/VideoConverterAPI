FROM node:latest

RUN apt-get ffmpeg

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "." ]