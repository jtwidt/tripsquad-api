'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TripAttendee extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  TripAttendee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled'), // ENUM definition
        allowNull: false,
        defaultValue: 'pending', // Optional: set default value
      },
    },
    {
      sequelize,
      modelName: 'TripAttendee', // PascalCase model name
      tableName: 'trip_attendees', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return TripAttendee;
};
