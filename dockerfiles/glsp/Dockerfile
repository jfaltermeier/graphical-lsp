FROM node:8

WORKDIR /glsp

COPY . /glsp

# Set location to place global npm dependencies
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN npm install -g yarn && npm install -g lerna

RUN apt-get update && apt-get install -y openjdk-8-jre && apt-get upgrade -y

EXPOSE 3000

WORKDIR /glsp/client/examples/workflow/browser-app

CMD ["sh", "-c", "java -jar ../../../../server/glsp.jar com.eclipsesource.glsp.example.workflow.ExampleServerLauncher & yarn start --hostname 0.0.0.0"]
