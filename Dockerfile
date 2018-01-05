FROM node:alpine

WORKDIR /usr/src/app

RUN apk add --update tzdata
RUN cp /usr/share/zoneinfo/Australia/Melbourne /etc/localtime
RUN echo "Australia/Melbourne" > /etc/timezone && date

COPY . .
RUN npm install

EXPOSE 3000
EXPOSE 6379

RUN apk del tzdata

CMD npm start
