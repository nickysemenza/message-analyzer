'use strict';
module.exports = function(sequelize, DataTypes) {
  let FacebookThread = sequelize.define('FacebookThread', {
    thread_id: DataTypes.STRING,
    name: DataTypes.STRING,
    message_count: DataTypes.INTEGER,
    downloaded_message_count: DataTypes.INTEGER,
    num_participants: DataTypes.INTEGER,
    participant_ids: DataTypes.TEXT,
    participant_names: DataTypes.TEXT,
    raw: DataTypes.TEXT
  }, {
    underscored: true,
    timestamps: false,
    tableName: 'facebook_threads',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FacebookThread;
};
