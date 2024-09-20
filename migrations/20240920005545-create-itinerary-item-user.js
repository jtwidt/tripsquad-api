'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('itinerary_item_users', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'canceled'), // Define ENUM for status
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    // First, drop the table that uses the ENUM type
    await queryInterface.dropTable('itinerary_item_users');

    // Then, drop the ENUM type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_itinerary_item_users_status";'
    );
  },
};
