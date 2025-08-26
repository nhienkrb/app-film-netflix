'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {}

  Profile.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(50), allowNull: false },
      maturity_level: { type: DataTypes.ENUM('child', 'teen', 'adult'), defaultValue: 'adult' },
    },
    {
      sequelize,
      modelName: 'Profile',
      tableName: 'profiles',
      underscored: true,
      createdAt:'created_at',
      updatedAt: false
    }
  );

  return Profile;
};
