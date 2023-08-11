#!/bin/sh
docker build -t belligerator/news-backend:prod .
docker push belligerator/news-backend:prod
