'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {}

  Plan.init(
    {
      name: { type: DataTypes.STRING(50), allowNull: false },
      price_per_month: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
      max_quality: { type: DataTypes.ENUM('SD', 'HD', 'FHD', 'UHD'), defaultValue: 'FHD' },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'Plan',
      tableName: 'plans',
      timestamps: false,
    }
  );

  return Plan;
};
