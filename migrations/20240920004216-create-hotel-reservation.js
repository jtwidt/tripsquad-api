'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hotel_reservations', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'canceled'), // ENUM definition in migration
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
    await queryInterface.dropTable('hotel_reservations');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_hotel_reservations_status";'
    );
  },
};
