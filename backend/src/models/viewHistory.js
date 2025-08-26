'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ViewHistory extends Model {}

  ViewHistory.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      movie_id: { type: DataTypes.INTEGER, allowNull: false },
      position_sec: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'ViewHistory',
      tableName: 'view_history',
      underscored: true,
      updatedAt: false,
    }
  );

  return ViewHistory;
};
