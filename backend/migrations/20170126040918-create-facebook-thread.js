'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('facebook_threads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thread_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      message_count: {
        type: Sequelize.INTEGER
      },
      downloaded_message_count: {
        type: Sequelize.INTEGER
      },
      num_participants: {
        type: Sequelize.INTEGER
      },
      participant_ids: {
        type: Sequelize.TEXT
      },
      raw: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('facebook_threads');
  }
};
