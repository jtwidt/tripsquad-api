import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Trip {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tripName: string;

    @ManyToOne(() => User, (user) => user.createdTrips)
    creator: User;

    @Column({ type: 'timestamptz' })
    tripStart: Date;

    @Column({ type: 'timestamptz' })
    tripEnd: Date;

    @Column({ array: true })
    destinations: string;

    @ManyToMany(() => User)
    @JoinTable()
    attendees: User[];
}
