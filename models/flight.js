'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Flight.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        as: 'traveller',
      });

      Flight.belongsTo(models.Trip, {
        foreignKey: 'tripId',
        onDelete: 'CASCADE',
        as: 'trip',
      });
    }
  }
  Flight.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Add this line to generate UUID automatically
        allowNull: false,
        primaryKey: true,
      },
      flightOrderNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Flight',
    }
  );
  return Flight;
};
