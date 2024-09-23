'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Flight extends Model {
    static associate(models) {
      // Define associations here if needed
      Flight.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
      Flight.belongsTo(models.User, { foreignKey: 'userId', as: 'flyer' });
    }
  }

  Flight.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tripId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      airline: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departureAirport: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalAirport: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      confirmationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Flight', // PascalCase model name
      tableName: 'flights', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return Flight;
};
