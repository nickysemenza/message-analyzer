'use strict';
module.exports = function(sequelize, DataTypes) {
  let FacebookMessage = sequelize.define('FacebookMessage', {
    sender_name: DataTypes.STRING,
    sender_id: DataTypes.STRING,
    thread_id: DataTypes.STRING,
    message_id: DataTypes.STRING,
    body: DataTypes.TEXT,
    raw: DataTypes.TEXT,
    attachments: DataTypes.TEXT,
    timestamp: DataTypes.STRING,
    tags: DataTypes.TEXT,
    log_message_data: DataTypes.TEXT
  }, {
    underscored: true,
    timestamps: false,
    tableName: 'facebook_messages',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FacebookMessage;
};
