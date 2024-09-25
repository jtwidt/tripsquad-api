'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Hotel extends Model {
    static associate(models) {
      // Define associations here if needed
      Hotel.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
      Hotel.belongsTo(models.Location, {
        foreignKey: 'locationId',
        as: 'location',
      });
      Hotel.hasMany(models.HotelReservation, {
        foreignKey: 'hotelId',
        as: 'reservations',
      });
    }
  }

  Hotel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      hotelName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      numberOfRooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      confirmationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Hotel', // PascalCase model name
      tableName: 'hotels', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return Hotel;
};
