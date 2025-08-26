'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {}

  Genre.init(
    {
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: 'Genre',
      tableName: 'genres',
    }
  );

  return Genre;
};
