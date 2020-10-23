FROM node:10


# install pnpm
RUN apt update
RUN apt install curl
RUN curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | node

WORKDIR /usr/src/itkmitl-tcas-backend
COPY package.json .
RUN pnpm install
ADD . /usr/src/itkmitl-tcas-backend

EXPOSE 3000
CMD [ "pnpm", "run", "prod" ]