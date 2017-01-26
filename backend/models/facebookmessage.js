'use strict';
module.exports = function(sequelize, DataTypes) {
  var FacebookMessage = sequelize.define('FacebookMessage', {
    sender_name: DataTypes.STRING,
    sender_id: DataTypes.STRING,
    thread_id: DataTypes.STRING,
    message_id: DataTypes.STRING,
    body: DataTypes.TEXT,
    raw: DataTypes.TEXT,
    attachments: DataTypes.TEXT,
    timestamp: DataTypes.STRING
  }, {
    tableName: 'facebook_messages',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FacebookMessage;
};
