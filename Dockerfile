FROM node:9.4.0-alpine
COPY ./ .
RUN npm install &&\
    apk update &&\
    apk upgrade
EXPOSE 8081
CMD npm start 
