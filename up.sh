#!/bin/bash

# Load the environment variables for the project
export $(egrep -v '^#' .env | xargs)

docker network ls|grep intrepid_apps > /dev/null || docker network create intrepid_apps

docker-compose down
docker-compose build
docker-compose up -d
