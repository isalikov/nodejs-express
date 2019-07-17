FROM iknpx/archnode

WORKDIR /usr/src
COPY . .

RUN yarn && \
    yarn build && \
    rm -rf ./node_modules && \
    yarn --production && \
    cp -r dist /usr/app && \
    cp -r node_modules /usr/app/node_modules

WORKDIR /usr/app
