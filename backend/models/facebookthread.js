'use strict';
module.exports = function(sequelize, DataTypes) {
  var FacebookThread = sequelize.define('FacebookThread', {
    thread_id: DataTypes.STRING,
    name: DataTypes.STRING,
    message_count: DataTypes.INTEGER,
    downloaded_message_count: DataTypes.INTEGER,
    num_participants: DataTypes.INTEGER,
    participant_ids: DataTypes.TEXT,
    raw: DataTypes.TEXT
  }, {
    tableName: 'facebook_threads',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FacebookThread;
};
