import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/nestdemo',
  ssl: process.env.DATABASE_SSL === 'true',
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  //   logging: process.env.NODE_ENV !== 'production',
  logging: false,
};

export const port = process.env.PORT || 3000;
