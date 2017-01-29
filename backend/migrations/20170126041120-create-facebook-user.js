'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('facebook_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facebook_id: {
        type: Sequelize.STRING,
        unique: true
      },
      first_name: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      raw: {
        type: Sequelize.TEXT
      }
    },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('facebook_users');
  }
};
