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
        type: Sequelize.STRING,
        unique: true
      },
      body: {
        type: Sequelize.TEXT('long')
      },
      raw: {
        type: Sequelize.TEXT('long')
      },
      attachments: {
        type: Sequelize.TEXT('long')
      },
      timestamp: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.TEXT
      },
      log_message_data: {
        type: Sequelize.TEXT
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
