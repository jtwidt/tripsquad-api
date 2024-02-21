"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserTrip extends Model {
    static associate(models) {
      // No need to define associations for the intermediary table
    }
  }

  UserTrip.init(
    {
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      tripId: {
        type: DataTypes.UUID,
        references: {
          model: "Trip",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "UserTrip",
    }
  );

  return UserTrip;
};
