import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL
    },
    // Можно поменять для продакшана параметры
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL
    }
};

export default config;
