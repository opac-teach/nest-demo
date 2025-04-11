import { NestFactory } from '@nestjs/core';
import { AppModule, registerGlobals } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { port } from '@/config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  registerGlobals(app);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config); // ✅ ici
  SwaggerModule.setup('swagger', app, document);              // ✅ ici

  await app.listen(port);
}
bootstrap();
