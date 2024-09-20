'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ItineraryItem extends Model {
    static associate(models) {
      // Define associations here if needed
      ItineraryItem.belongsTo(models.Trip, { foreignKey: 'tripId' });
      ItineraryItem.hasMany(models.ItineraryItemUser, {
        foreignKey: 'itineraryItemId',
      });
    }
  }

  ItineraryItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
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
      modelName: 'ItineraryItem', // PascalCase model name
      tableName: 'itinerary_items', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return ItineraryItem;
};
