'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('facebook_attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message_id: {
        type: Sequelize.STRING
      },
      thread_id: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      sticker_id: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING,
        unique: true
      },
      filename: {
        type: Sequelize.STRING
      },
      file_hash: {
        type: Sequelize.STRING
      },
      raw: {
        type: Sequelize.TEXT('long')
      }
    },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('facebook_attachments');
  }
};
