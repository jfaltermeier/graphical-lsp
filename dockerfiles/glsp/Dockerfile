FROM node:8

WORKDIR /glsp

COPY . /glsp

# Set location to place global npm dependencies
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install -g yarn && npm install -g lerna

EXPOSE 3000

WORKDIR /glsp/client/examples/workflow/browser-app

CMD ["yarn", "start", "--hostname", "0.0.0.0"]
