# NestJS backend for the News Mobile App

## About

Welcome to the News App Backend project! This repository serves as the backend component for the [News App](https://github.com/Belligerator/news-app), a Flutter application designed to deliver the latest news to users. The backend is built to provide data and functionality to support the app's features.

Backend is built using [NestJS](https://nestjs.com/), a NodeJS framework. It is a REST API that provides endpoints for the app to consume. For data storage, the backend uses [MySQL](https://www.mysql.com/) and interacts with it using [TypeORM](https://typeorm.io/).

This project is made as a sample project and implements some of the common features found in a typical backend application. List of features:

- REST Api (CRUD operations)
- GraphQL basics (query, mutation)
- Authentication and Authorization (JWT, basic auth, username/password login)
- Firebase Cloud Messaging (FCM) push notifications (via firebase-admin)
- Sending emails
- Exporting data to Excel file
- File uploads and downloads
- Dockerization
- Cron jobs
- Sentry error logging
- Serving static files
- Migration scripts
- Exception filters
- Logging to file and managing log files

## Demo

A demo of the backend can be found at https://news.belligerator.cz/api/. The demo is running on a Docker container.

For that purpose I have created a docker image for the backend. The image can be found at https://hub.docker.com/r/belligerator/news-backend. The image is built using the Dockerfile in the root directory of this repository.

On the server, there is docker-compose file that is used to run the backend and MySQL database. The file can be found at https://github.com/Belligerator/news-docker.

### Mobile application

Mobile application is built using Flutter (v3.7.1) and source codes can be found at https://github.com/Belligerator/news-app. It is connected to the demo backend and can be downloaded at https://belligerator.cz/downloads/ (`news-<version>.apk`). It is available for Android only.

## Getting Started

### Prerequisites

For running the backend locally, you will need the following:

- [NodeJS](https://nodejs.org/en/) (v18)
- [NestJS](https://nestjs.com/) (v10)
- [MySQL](https://www.mysql.com/) (v5.7)
- [Docker](https://www.docker.com/) (v20) - not required, it was used for creating the image and running the demo from the server.

### Installation

1. Clone the repo [news-backend](https://github.com/Belligerator/news-backend)
   ```sh
   git clone git@github.com:Belligerator/news-backend.git
    ```

2. Install NPM packages
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and fill in the required environment variables. You can refer to the `.env.example` file for the required variables.


4. Create database schema `news` in database. Migration scripts will create the tables in the next step.


5. Run the app
    ```sh
    npm run start
    ```
    The app should be running on `http://localhost:3000/`.


6. In the root directory, there is a `news.postman_collection.json` file that contains a Postman collection with sample requests. You can import it into Postman and use it to test the endpoints.

## Documentation

Documentation for the endpoints can be found at https://news.belligerator.cz/api/swagger.

Documentation for the backend can be found at https://news.belligerator.cz/api/documentation.
