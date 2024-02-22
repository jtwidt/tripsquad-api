'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Address, {
        foreignKey: 'userId',
        as: 'addresses',
      });

      User.hasMany(models.Trip, {
        foreignKey: 'creatorId',
        as: 'createdTrips',
      });

      User.belongsToMany(models.Trip, {
        through: 'UserTrip',
        foreignKey: 'userId',
        otherKey: 'tripId',
        as: 'attendingTrips',
      });

      User.hasMany(models.Flight, {
        foreignKey: 'userId',
        as: 'flights',
      });

      User.hasMany(models.Hotel, {
        foreignKey: 'userId',
        as: 'hotels',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Add this line to generate UUID automatically
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
