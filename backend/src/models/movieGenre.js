'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MovieGenre extends Model {}

  MovieGenre.init(
    {
      movie_id: { type: DataTypes.INTEGER, primaryKey: true },
      genre_id: { type: DataTypes.INTEGER, primaryKey: true },
    },
    {
      sequelize,
      modelName: 'MovieGenre',
      tableName: 'movie_genres',
    }
  );

  return MovieGenre;
};
