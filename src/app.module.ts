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

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    CatModule,
    BreedModule,
    CatModule,
    BreedModule,
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
