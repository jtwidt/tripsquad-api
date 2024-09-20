'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ItineraryItemUser extends Model {
    static associate(models) {
      // Define associations here
      ItineraryItemUser.belongsTo(models.ItineraryItem, {
        foreignKey: 'itineraryItemId',
      });
      ItineraryItemUser.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  ItineraryItemUser.init(
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
        defaultValue: 'pending', // Optional: set default value
      },
    },
    {
      sequelize,
      modelName: 'ItineraryItemUser', // PascalCase model name
      tableName: 'itinerary_item_users', // Underscored table name
      underscored: true, // Enables underscored column names
      timestamps: true, // Enables createdAt and updatedAt fields
      freezeTableName: true, // Ensures the table name is not pluralized
    }
  );

  return ItineraryItemUser;
};
