FROM iknpx/archnode

WORKDIR /usr/src
COPY . .

RUN yarn --silent && \
    yarn babel ./src --out-dir ./out --presets minify && \
    cp ./src/env.json ./out && \
    rm -rf ./node_modules && \
    yarn --production && \
    cp -r out /usr/app && \
    cp -r node_modules /usr/app/node_modules

WORKDIR /usr/app
CMD ["node", "./index.js"]
