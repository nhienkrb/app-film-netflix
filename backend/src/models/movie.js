"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {}

  Movie.init(
    {
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: DataTypes.TEXT,
      duration_min: DataTypes.INTEGER,
      release_year: DataTypes.INTEGER,
      poster_url: DataTypes.STRING(500),
      age_rating: DataTypes.STRING(10),
      avg_rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 },
      link_ytb: { type: DataTypes.STRING(500), allowNull: true },
      public_id_poster: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      sequelize,
      modelName: "Movie",
      tableName: "movies",
      underscored: true,
     createdAt:"created_at",
     updatedAt: "updated_at"
    }
  );

  return Movie;
};
