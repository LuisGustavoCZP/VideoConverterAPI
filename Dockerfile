FROM node:latest as video-converter-base

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

COPY package*.json ./

RUN npm install

FROM node:latest as video-converter-build
#-base

COPY package*.json ./

RUN npm install

RUN npm update

COPY . .

RUN npm run build

#FROM video-converter-build-base as video-converter-build

#RUN npm run build

FROM video-converter-base as video-converter

COPY ./static ./static

COPY ./upload ./upload

COPY --from=video-converter-build /dist .

EXPOSE 3000

CMD [ "node", "." ]