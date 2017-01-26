'use strict';
module.exports = function(sequelize, DataTypes) {
  var FacebookUser = sequelize.define('FacebookUser', {
    faecbook_id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    full_name: DataTypes.STRING,
    raw: DataTypes.TEXT
  }, {
    tableName: 'facebook_users',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FacebookUser;
};
