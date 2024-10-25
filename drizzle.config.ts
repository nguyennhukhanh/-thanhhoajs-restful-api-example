import { type Config, defineConfig } from 'drizzle-kit';

import { dbConfig } from './src/configs/database.config';

export default defineConfig({
  dialect: dbConfig.type as Config['dialect'],
  dbCredentials: {
    host: dbConfig.host as string,
    port: dbConfig.port,
    user: dbConfig.username,
    database: dbConfig.database as string,
    password: dbConfig.password,
  },
  schema: './src/database/schemas',
  out: './src/database/migrations',
});
