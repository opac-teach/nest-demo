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

The main app is located in the [/app](./app) folder, please refer to the [README](./app/README.md) for more information.

There is also a microservice app which is located in the [/app-microservice](./app-microservice) folder.

## Docker

To run the all the stack with dependencies, you can use the following command:

```bash
docker compose up -d --build
```

> The main app is currently disabled to run it without docker in develpment mode, you can enable it by uncommenting the `app` service in the [docker-compose.yml](./docker-compose.yml) file.

## Conventional Branches

The branches have their name based on conventions rules that are described on the next conventional branches website : https://conventional-branch.github.io/

## Conventional Commits

The commits have their name based on conventions rules that are described on the next conventional commits website : https://www.conventionalcommits.org/en/v1.0.0/

## Roadmap

### Step 1 : User management
Extend the project to include a complete user entity.

Objectives:

- Create a user entity with relevant profile information (username, description, etc.)
- Establish a relationship between chats and users: each chat belongs to a single user, and one user can have multiple chats
- Develop CRUD routes for user management
- Implement search functionality to filter chats by owner and include user data when retrieving chat information

### Step 2 : Authentication system
Implement a secure authentication system for the application.

Objectives:

- Define and implement the necessary attributes in the user entity (email, hashed password, etc.)
- Develop the complete authentication system with registration, login, and token management
- Secure existing routes based on authentication needs:
  - Restrict the modification or deletion of profiles to the respective owners
  - Restrict access to chat/race management features to authenticated users
  - Automatically associate a newly created chat to the authenticated user who is creating it

### Step 3 : Comment system
Allow users to interact via comments on chat profiles.

Objectives:

- Design the comment entity with appropriate relationships
- Create the necessary routes to manage comments (creation, reading, editing, deletion)
- Establish the relationships between comments, users and chats
- Implement security rules so that users can only edit or delete their own comments

### Step 4 : Feline reproduction functionality
Develop a system allowing the crossing of cats to create new kittens.

Objectives:

- Create a route dedicated to the crossing of two existing cats
- Check that both chats belong to the logged-in user
- Manage the heredity of races:
  - If the parents are of the same breed, the kitten inherits from that breed
  - If the parents are of different races, create a new race with a seed derived from the parent breeds
  - Alternatively, allow the creation of several kittens with random allocation of parental breeds

### Step 5 : Cross-ownership
Enrich the breeding system to allow crosses between cats of different owners.

Objectives:

- Design an application and approval system for crossovers (request, acceptance, refusal)
- Develop the entities and routes necessary to manage cross requests
- Implement the execution logic of approved crosses and management of the resulting kitten ownership

### Step 6 : Data modelling
Develop a visual representation of the application data architecture.

Objectives:

- Create a UML diagram showing the entities and their relationships
- Embed this diagram in a Markdown file within the project
- Use the [Mermaid](https://mermaid.js.org/syntax/entityRelationshipDiagram.html) syntax for clear and interactive visualization

### Step 7 : Roles and permissions system
Implement a role-based access control system.

Objectives:

- Define different user roles with their respective permissions
- Adapt the authentication system to integrate role management
- Create or modify routes to restrict access based on roles

Example of role hierarchy:

- Administrator: full access to all features, user role management
- Moderator: ability to moderate the comments of all users
- Standard user: limited access to basic functionality