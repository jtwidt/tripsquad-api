"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trip.init(
    {
      tripName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "trip_name",
      },
      tripStart: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "trip_start",
      },
      tripEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "trip_end",
      },
    },
    {
      sequelize,
      modelName: "Trip",
      tableName: "trips",
    }
  );
  return Trip;
};
