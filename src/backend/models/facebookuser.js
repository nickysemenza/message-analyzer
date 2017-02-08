'use strict';
module.exports = function(sequelize, DataTypes) {
  let FacebookUser = sequelize.define('FacebookUser', {
    facebook_id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    full_name: DataTypes.STRING,
    raw: DataTypes.TEXT
  }, {
    tableName: 'facebook_users',
    underscored: true,
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FacebookUser;
};
