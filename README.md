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
- Websocket serveur for data modification events
- Database connection with TypeORM
- Unit testing with Jest
- End2end testing with Supertest
- Middleware for logging
- Guard for random error generation

## API Documentation

The API documentation is available at the `/swagger` endpoint.

# Development

The main app is located in the [/app](./app) folder, please refer to its README for more information.

There is also a microservice app which is located in the [/app-microservice](./app-microservice) folder.

## Install and run the project

To run the all the stack with dependencies, you can use the following command:

```bash
cd app
```
```bash
npm install
```
```bash
npm run dev
```