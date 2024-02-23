'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Destination.belongsToMany(models.Trip, {
        through: 'TripDestination',
        foreignKey: 'destinationId',
        otherKey: 'tripId',
        as: 'destinations',
        unique: true,
      });
    }
  }
  Destination.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Add this line to generate UUID automatically
        allowNull: false,
        primaryKey: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Destination',
    }
  );
  return Destination;
};
