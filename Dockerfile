FROM node:10.13.0-alpine


# install pnpm
RUN apk --no-cache add curl
RUN apk add --no-cache bash
RUN curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | node

WORKDIR /usr/src/itkmitl-tcas-backend
COPY package.json .
RUN pnpm install
ADD . /usr/src/itkmitl-tcas-backend

EXPOSE 3000
CMD [ "pnpm", "run", "prod" ]