'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('facebook_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender_name: {
        type: Sequelize.STRING
      },
      sender_id: {
        type: Sequelize.STRING
      },
      thread_id: {
        type: Sequelize.STRING
      },
      message_id: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
      raw: {
        type: Sequelize.TEXT
      },
      attachments: {
        type: Sequelize.TEXT
      },
      timestamp: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('facebook_messages');
  }
};