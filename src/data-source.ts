import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'tripsquad_db',
    password: '12qwaszx!@QWASZX',
    database: 'tripsquad',
    synchronize: true,
    logging: false,
    entities: ['entity/*.js'],
    migrations: [],
    subscribers: [],
});
