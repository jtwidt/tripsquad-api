'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HotelReservation extends Model {
    static associate(models) {
      // Define associations here if needed
      HotelReservation.belongsTo(models.Hotel, {
        foreignKey: 'hotelId',
        as: 'hotel',
      });
      HotelReservation.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  HotelReservation.init(
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
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'HotelReservation', // PascalCase model name
      tableName: 'hotel_reservations', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return HotelReservation;
};
