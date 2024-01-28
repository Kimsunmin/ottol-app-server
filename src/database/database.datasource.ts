import loadConfiguration, { Configuration } from '@/config/loadConfiguration';
import {
  TypeOrmDataSourceFactory,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeormModuleOptionFactory = async (
  config: Configuration &
    Required<{ entities: TypeOrmModuleOptions['entities'] }>,
) => {
  const {
    DB_TYPE,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    entities,
  } = config;

  const options: TypeOrmModuleOptions = {
    type: DB_TYPE,
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: false,
    entities: entities,
    namingStrategy: new SnakeNamingStrategy(),
    logging: true,
  };

  return options;
};

export const dataSourceFactory: TypeOrmDataSourceFactory = async (options) => {
  if (!(options?.type === 'postgres')) {
    throw new Error('Database type is not postgres, Check your database type');
  }
  return new DataSource(options);
};

const datasourceFactoryForMigrations = async () => {
  const config = await loadConfiguration();

  const entitiesFiles = resolve(__dirname, '..', '**', '*.entity.ts');
  const migrationsFiles = resolve(__dirname, '..', '..', 'migrations', '*.ts');

  const options = {
    type: config.DB_TYPE,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    host: config.DB_HOST,
    database: config.DB_DATABASE,
    entities: [entitiesFiles],
    migrations: [migrationsFiles],
    namingStrategy: new SnakeNamingStrategy(),
  } as TypeOrmModuleOptions;

  return new DataSource({ ...options } as DataSourceOptions);
};

export default datasourceFactoryForMigrations();
