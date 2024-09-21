'use strict';

const { generateReferralCode } = require('../helpers/generic.helper');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('trips', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      trip_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('planned', 'ongoing', 'completed', 'canceled'), // ENUM definition in migration
        allowNull: false,
        defaultValue: 'planned',
      },
      referral_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: generateReferralCode(8),
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
    await queryInterface.dropTable('trips');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_trips_status";'
    );
  },
};
