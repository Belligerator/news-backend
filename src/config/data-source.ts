import { DataSource } from 'typeorm';
import databaseConfig from './database-config';

/**
 * For migration purposes. Used in package.json.
 */
export const AppDataSource: DataSource = new DataSource(databaseConfig);
