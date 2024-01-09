import loadConfiguration, {
  Environment,
  findDirectoryForFile,
} from '@/config/loadConfiguration';
import { NotFoundException } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const datasourceFactory = async () => {
  const env = Environment.parse(process.env.NODE_ENV);
  const fileName = `.env.${env}`;

  const fileDirectory = await findDirectoryForFile(fileName);
  if (!fileDirectory) {
    throw new NotFoundException(`${fileName} is not found`);
  }

  const filePath = resolve(fileDirectory, fileName);
  dotenv.config({
    path: filePath,
  });

  const config = await loadConfiguration();

  const options = {
    type: config.DB_TYPE,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    host: config.DB_HOST,
    database: config.DB_DATABASE,
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
  } as TypeOrmModuleOptions;

  return new DataSource({ ...options } as DataSourceOptions);
};

export default datasourceFactory();
