import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const databaseConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: 3306,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    entities: [
        __dirname + '/../endpoints/**/*.entity{.ts,.js}',
        __dirname + '/../entities/**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    logging: false,
    charset: 'utf8_unicode_ci',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: true
};

export default databaseConfig;
