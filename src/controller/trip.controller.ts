import { Request, Response } from 'express';

import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Trip } from '../entity/Trip';
import { In } from 'typeorm';

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
