import { Request, Response } from 'express';

import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Trip } from '../entity/Trip';
import { In } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);

export const createTrip = async (req: Request, res: Response) => {
    const tripInfo = req.body;
    const trip = new Trip();
    trip.tripName = tripInfo.tripName;

    const creator = await AppDataSource.manager.findOneBy(User, {
        id: tripInfo.creatorId,
    });
    if (creator) {
        trip.creator = creator;
    }

    trip.creator = tripInfo.creatorId;
    trip.tripStart = tripInfo.tripStart;
    trip.tripEnd = tripInfo.tripEnd;
    trip.destinations = tripInfo.destinations;

    const attendees = await AppDataSource.manager.findBy(User, {
        id: In(tripInfo.attendees),
    });
    if (attendees) {
        trip.attendees = attendees;
    }

    await AppDataSource.manager.save(trip);
    const fullTrip = await AppDataSource.manager.find(Trip, {
        where: { id: trip.id },
        relations: { creator: true, attendees: true },
    });
    return res.status(201).send({ trip: fullTrip });
};

export const getTrip = async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const trip = await AppDataSource.manager.findOne(Trip, {
        where: { id: tripId },
        relations: { creator: true, attendees: true },
    });
    if (!trip) {
        return res
            .status(404)
            .send({ message: 'No trip could be found with that ID.' });
    } else {
        return res.status(200).send({ trip: trip });
    }
};

export const getAllUserCreatedTrips = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const userTrips = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.createdTrips', 'trip')
        .where('user.id = :id', { id: userId })
        .orderBy('trip.tripStart')
        .getMany();
    if (!userTrips) {
        return res.status(404).send({ message: 'No user found with that ID.' });
    }
    return res.status(200).send({ trips: userTrips });
};

export const getUpcomingUserCreatedTrips = async (
    req: Request,
    res: Response
) => {
    const userId = req.body.userId;
    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-US');
    const userTrips = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.createdTrips', 'trip')
        .where('user.id = :id', { id: userId })
        .andWhere('trip.tripEnd >= :now', { now: formattedNow })
        .orderBy('trip.tripStart')
        .getMany();
    if (!userTrips) {
        return res.status(404).send({ message: 'No user found with that ID.' });
    }
    return res.status(200).send({ trips: userTrips });
};

export const getAllUserAttendingTrips = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const userTrips = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.attendingTrips', 'trip')
        .where('user.id = :id', { id: userId })
        .orderBy('trip.tripStart')
        .getMany();
    if (!userTrips) {
        return res.status(404).send({ message: 'No user found with that ID.' });
    }
    return res.status(200).send({ trips: userTrips });
};

export const getUpcomingUserAttendingTrips = async (
    req: Request,
    res: Response
) => {
    const userId = req.body.userId;
    const now = new Date();
    const formattedNow = now.toLocaleDateString('en-US');
    const userTrips = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.attendingTrips', 'trip')
        .where('user.id = :id', { id: userId })
        .andWhere('trip.tripEnd >= :now', { now: formattedNow })
        .orderBy('trip.tripStart')
        .getMany();
    if (!userTrips) {
        return res.status(404).send({ message: 'No user found with that ID.' });
    }
    return res.status(200).send({ trips: userTrips });
};

export const editTrip = async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const { tripName, tripStart, tripEnd, destinations, attendees } = req.body;

    let trip = await AppDataSource.manager.findOne(Trip, {
        where: { id: tripId },
        relations: { creator: true, attendees: true },
    });

    if (!trip) {
        return res.status(404).send({ message: 'No trip found with this ID' });
    } else {
        // Create a new instance of the Trip entity
        const updatedTrip = new Trip();
        updatedTrip.id = trip.id; // Make sure to set the ID to retain the same record

        // Update properties only if they are not null
        updatedTrip.creator = trip.creator;
        updatedTrip.tripName = tripName ? tripName : trip.tripName;
        updatedTrip.tripStart = tripStart ? tripStart : trip.tripStart;
        updatedTrip.tripEnd = tripEnd ? tripEnd : trip.tripEnd;
        updatedTrip.destinations = destinations
            ? destinations
            : trip.destinations;

        if (attendees) {
            const newAttendees = await AppDataSource.manager.findBy(User, {
                id: In(attendees),
            });

            if (newAttendees) {
                // Update the attendees property with the newAttendees
                updatedTrip.attendees = newAttendees;
            }
        } else {
            updatedTrip.attendees = trip.attendees;
        }

        // Save the updatedTrip instance
        await AppDataSource.manager.save(updatedTrip);

        // Fetch the updatedTrip to include the relations
        const fullUpdatedTrip = await AppDataSource.manager.findOne(Trip, {
            where: { id: tripId },
            relations: { creator: true, attendees: true },
        });

        return res.status(200).send({ trip: fullUpdatedTrip });
    }
};
