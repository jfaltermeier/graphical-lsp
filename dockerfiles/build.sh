#!/bin/bash
SERVER_VERSION=1.2.0

echo [~] CLEAN-UP [~]
rm -rf glsp/client
rm -rf glsp/server

echo [~] BUILDING SERVER [~]
mvn clean verify -Pfatjar -f ../server/pom.xml

echo [~] BUILDING CLIENT [~]
cd ../client
yarn
cd ../dockerfiles

echo [~] COPY SERVER BUILD RESULTS [~]
mkdir glsp/server
cp ../server/example/workflow-example/target/workflow-example-${SERVER_VERSION}-SNAPSHOT-glsp.jar glsp/server/glsp.jar

echo [~] COPY CLIENT BUILD RESULTS [~]
mkdir glsp/client
cp -r ../client glsp

echo [~] BUILD DOCKER [~]
cd glsp
docker build --tag=glsp-example .
cd ..
