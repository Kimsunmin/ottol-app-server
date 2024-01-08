import { NotFoundException } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const datasourceFactory = () => {
  const cwd = process.cwd();
  const envFilePath = resolve(cwd, `.env.dev`);

  if (!existsSync(envFilePath)) {
    throw new NotFoundException('env file is not found');
  }

  dotenv.config({
    path: envFilePath,
  });

  const options = {
    type: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
  } as TypeOrmModuleOptions;

  return new DataSource({ ...options } as DataSourceOptions);
};

export default datasourceFactory();
