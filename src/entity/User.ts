import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Trip } from './Trip';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    address1: string;

    @Column({ nullable: true })
    address2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    postCode: string;

    @OneToMany(() => Trip, (trip) => trip.creator)
    createdTrips: Trip[];

    @ManyToMany(() => Trip, (trip) => trip.attendees)
    attendedTrips: Trip[];
}
