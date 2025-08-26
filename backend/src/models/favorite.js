'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {}

  Favorite.init(
    {
      user_id: { type: DataTypes.INTEGER, primaryKey: true },
      movie_id: { type: DataTypes.INTEGER, primaryKey: true },
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'favorites',
      timestamps: false,
      underscored: true,
       createdAt:'created_at',
      updatedAt: false
    }
  );

  return Favorite;
};
