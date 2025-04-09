import { NestFactory } from '@nestjs/core';
import { AppModule, registerGlobals } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { port } from '@/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  registerGlobals(app);
  // Enable swagger and OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(port);
}
bootstrap();
