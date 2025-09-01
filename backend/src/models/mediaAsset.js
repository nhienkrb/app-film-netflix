'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MediaAsset extends Model {}

  MediaAsset.init(
    {
      public_id: {
        type: DataTypes.STRING(255),   
        primaryKey: true,
        allowNull: false,
      },
      movie_id: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.ENUM('trailer', 'full'), allowNull: false },
      quality: { type: DataTypes.ENUM('SD', 'HD', 'FHD', 'UHD'), defaultValue: 'HD' },
      url: { type: DataTypes.STRING(500), allowNull: false },
    },
    {
      sequelize,
      modelName: 'MediaAsset',
      tableName: 'media_assets',
      underscored: true,
       createdAt:'created_at',
      updatedAt: false
    }
  );

  return MediaAsset;
};
