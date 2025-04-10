<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Main app for the NestJS demo.

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
# run development server
$ npm run dev

# production mode
$ npm run build
$ npm run start:prod
```

## Run tests

```bash
# all tests
$ npm run test

# unit tests
$ npm run test:unit
$ npm run test:unit:watch

# e2e tests
$ npm run test:e2e
$ npm run test:e2e:watch

# test coverage
$ npm run test:cov
```

# TODO

- Caching
- Transactions
- Stats
- Migrations
- CORS
- Auth (jwt/cookies)
- GraphQL
- Task scheduling
- versioning
- compression
- file upload
- streaming
- gh actions
