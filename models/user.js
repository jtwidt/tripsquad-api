'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed
      User.hasMany(models.Trip, { foreignKey: 'createdBy' });
      User.hasMany(models.Flight, { foreignKey: 'userId' });
      User.hasMany(models.HotelReservation, { foreignKey: 'userId' });
      User.hasMany(models.ItineraryItemUser, { foreignKey: 'userId' });
      User.belongsToMany(models.Trip, {
        through: 'TripAttendee',
        foreignKey: 'userId',
        otherKey: 'tripId',
        as: 'attendedTrips',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      clerkId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preferences: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User', // PascalCase model name
      tableName: 'users', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return User;
};
