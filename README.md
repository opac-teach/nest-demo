<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) demonstration app.

This is a basic NestJS application which showcases fundamentals features of the framework.

### Project description

This project is a RESTful API that allows to manage cats and breeds.

#### Functional features

- A list of breeds with CRUD operations
- A list of cats with breed with CRUD operations
- Each breed has a seed that is not exposed publicly which serves to generate cat's colors

#### Technical features

- OpenAPI specification
- Input validation & Output serialisation
- Database connection with TypeORM
- Unit testing with Jest
- End2end testing with Supertest
- Middleware for logging
- Guard for random error generation

## API Documentation

The API documentation is available at `/swagger` endpoint.

# Development

## Project setup

Needs NodeJS 22+ and Docker installed.

```bash
# install dependencies
$ npm install

# start the database
$ docker compose up -d
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# unit tests (watch)
$ npm run test:watch

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# TODO

- Queuing
- Websockets
- Caching
- Stats
- Migrations
- Docker prod
- CORS
- Auth (jwt/cookies)
- GraphQL
- MicroServices
- Serverless

- Task scheduling
- versioning
- events
- compression
- file upload
- streaming
