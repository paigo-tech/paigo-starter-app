FROM node:16.20.1-alpine
LABEL maintainer="daniel.wasserlauf@paigo.tech"
 RUN apk update \
    && apk add sqlite \
    && apk add socat
WORKDIR /paigo-query-transform
COPY . /paigo-query-transform/
RUN npm ci
CMD ["npm", "run", "start:prod"]