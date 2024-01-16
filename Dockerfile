FROM node:20

WORKDIR /usr/src
COPY . .

RUN yarn install && \
    yarn dist && \
    mkdir -p /usr/app && \
    cp -r ./dist/* /usr/app/

WORKDIR /usr/app

RUN yarn --production && \
    rm -rf /usr/src

CMD ["yarn", "start"]
