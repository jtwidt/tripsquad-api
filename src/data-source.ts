import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Trip } from './entity/Trip';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'tripsquad_db',
    password: '12qwaszx!@QWASZX',
    database: 'tripsquad',
    synchronize: true,
    logging: false,
    entities: [User, Trip],
    migrations: [],
    subscribers: [],
});
