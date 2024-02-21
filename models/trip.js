'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trip.belongsToMany(models.User, {
        through: 'UserTrip',
        foreignKey: 'tripId',
        otherKey: 'userId',
        as: 'attendees',
        unique: true,
      });

      Trip.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      });

      Trip.hasMany(models.Flight, {
        foreignKey: 'tripId',
        as: 'flights',
      });
    }
  }
  Trip.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Add this line to generate UUID automatically
        allowNull: false,
        primaryKey: true,
      },
      tripName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tripStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tripEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Trip',
    }
  );
  return Trip;
};
