import {
  ClassSerializerInterceptor,
  INestApplication,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { CatModule } from './cat/cat.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { BreedModule } from './breed/breed.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { Reflector } from '@nestjs/core';
import { LiveModule } from './live/live.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EventEmitterModule.forRoot(),
    CatModule,
    BreedModule,
    LiveModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

export function registerGlobals(app: INestApplication) {
  // Enable validation globally
  // This will automatically validate all incoming requests using the DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // will remove any properties that are not defined in the DTO
      transform: true, // will convert incoming values to the correct types
    }),
  );

  // Enable class serialization globally
  // This will automatically serialize all responses using the @Exclude decorator
  // Sensitive fields will always be excluded from responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}
