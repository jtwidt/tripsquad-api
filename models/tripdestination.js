'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripDestination extends Model {
    static associate(models) {
      // No need to define associations for the intermediary table
    }
  }

  TripDestination.init(
    {
      destinationId: {
        type: DataTypes.UUID,
        references: {
          model: 'Destination',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      tripId: {
        type: DataTypes.UUID,
        references: {
          model: 'Trip',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'TripDestination',
    }
  );

  return TripDestination;
};
