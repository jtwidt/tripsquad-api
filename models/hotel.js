'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotel.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        as: 'guest',
      });

      Hotel.belongsTo(models.Trip, {
        foreignKey: 'tripId',
        onDelete: 'CASCADE',
        as: 'trip',
      });
    }
  }
  Hotel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Add this line to generate UUID automatically
        allowNull: false,
        primaryKey: true,
      },
      bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      providerConfirmationId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Hotel',
    }
  );
  return Hotel;
};
