'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {}

  Rating.init(
    {
      movie_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      stars: { type: DataTypes.TINYINT, allowNull: true },
      comment: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      underscored: true,
      updatedAt: false, // bảng chỉ có created_at
    }
  );

  return Rating;
};
