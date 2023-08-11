#!/bin/sh
set -e
npm run lint
docker build -t belligerator/news-backend:prod .
docker push belligerator/news-backend:prod
