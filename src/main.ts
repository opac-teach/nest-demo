import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Enable swagger and OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
