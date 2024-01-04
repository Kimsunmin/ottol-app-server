import { NotFoundException } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const datasourceFactory = () => {
  const cwd = process.cwd();
  const envFilePath = resolve(cwd, `.env.dev`);

  if (!existsSync(envFilePath)) {
    throw new NotFoundException('env file is not found');
  }

  dotenv.config({
    path: envFilePath,
  });

  console.log(cwd);
  console.log(process.env.DB_HOST);
  return {} as TypeOrmModuleOptions;
};

export default datasourceFactory();
