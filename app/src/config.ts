import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/nestdemo',
  ssl: process.env.DATABASE_SSL === 'true',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  //   logging: process.env.NODE_ENV !== 'production',
  logging: false,
};

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const port = process.env.PORT || 3000;
export const jwtSecret = process.env.JWT_TOKEN || 'secretKey';