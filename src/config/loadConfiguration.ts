import { existsSync } from 'fs';
import { delimiter, resolve } from 'path';
import * as z from 'zod';

export const Environment = z.enum(['prod', 'dev']).catch('dev').default('dev');

export const Configuration = z.object({
  env: Environment,
  PORT: z.number().or(z.string()),
  DB_TYPE: z.literal('postgres'),
  DB_HOST: z.string(),
  DB_PORT: z.number().or(z.string()),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  LOTTO_API_BASE_URL: z.string().url(),
});

export type Configuration = z.infer<typeof Configuration>;

export async function findDirectoryForFile(
  fileName: string,
): Promise<string | undefined> {
  const cwd = process.cwd();
  const paths = cwd.split(delimiter);

  const result = paths.reduce((acc, _, index, arr) => {
    if (typeof acc === 'string') {
      return acc;
    }

    const i = paths.length - index;
    const path = arr.slice(0, i).join(delimiter);
    if (existsSync(resolve(path, fileName))) {
      return path;
    }
    return undefined;
  }, undefined as string | undefined);

  return result;
}

export default async function loadConfiguration() {
  const env = Environment.parse(process.env.NODE_ENV);

  const configuration = Configuration.parse({
    env,
    PORT: process.env.PORT,
    DB_TYPE: 'postgres',
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    LOTTO_API_BASE_URL: process.env.LOTTO_API_BASE_URL,
  }) satisfies Configuration;

  return configuration;
}
