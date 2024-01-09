import { Environment, findDirectoryForFile } from './loadConfiguration';

describe('findDirectoryForFile', () => {
  it('should return file path for fileName', async () => {
    const env = Environment.parse(process.env.NODE_ENV);
    const fileName = `.env.${env}`;
    const result = await findDirectoryForFile(fileName);

    expect(result).toBe(process.cwd());
  });
});
