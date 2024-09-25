'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hotels', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      hotel_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      check_in: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      check_out: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      number_of_rooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      confirmation_number: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('hotels');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_hotel_status";'
    );
  },
};
