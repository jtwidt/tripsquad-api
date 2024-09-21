'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Trip extends Model {
    static associate(models) {
      // Define associations here if needed
      Trip.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
      Trip.hasMany(models.Flight, { foreignKey: 'tripId', as: 'flights' });
      Trip.hasMany(models.Hotel, { foreignKey: 'tripId', as: 'hotels' });
      Trip.hasMany(models.ItineraryItem, {
        foreignKey: 'tripId',
        as: 'itinerary',
      });
      Trip.belongsToMany(models.User, {
        through: 'TripAttendee',
        foreignKey: 'tripId',
        otherKey: 'userId',
        as: 'attendees',
      });
    }
  }

  Trip.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tripName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('planned', 'ongoing', 'completed', 'canceled'), // ENUM definition
        allowNull: false,
        defaultValue: 'planned', // Optional: default value
      },
    },
    {
      sequelize,
      modelName: 'Trip', // PascalCase model name
      tableName: 'trips', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return Trip;
};
