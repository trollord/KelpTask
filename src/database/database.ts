import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async () => {
    const client = new Client({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
    });

    await client
      .connect()
      .then(() => console.log('Connected to the database'))
      .catch((error) =>
        console.error('Error connecting to the database:', error),
      );

    return client;
  },
};
