import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Trip {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tripName: string;

    @ManyToOne(() => User, (user) => user.createdTrips)
    @JoinColumn()
    creator: User;

    @Column({ type: 'timestamptz' })
    tripStart: Date;

    @Column({ type: 'timestamptz' })
    tripEnd: Date;

    @Column({ array: true })
    destinations: string;

    @ManyToMany(() => User, (user) => user.attendingTrips, { cascade: true })
    @JoinTable()
    attendees: User[];
}
