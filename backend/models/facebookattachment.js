'use strict';
module.exports = function(sequelize, DataTypes) {
  let FacebookAttachment = sequelize.define('FacebookAttachment', {
    message_id: DataTypes.STRING,
    thread_id: DataTypes.STRING,
    type: DataTypes.STRING,
    sticker_id: DataTypes.STRING,
    url: DataTypes.STRING,
    hash: DataTypes.STRING,
    filename: DataTypes.STRING,
    raw: DataTypes.TEXT
  }, {
    underscored: true,
    timestamps: false,
    tableName: 'facebook_attachments',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FacebookAttachment;
};
