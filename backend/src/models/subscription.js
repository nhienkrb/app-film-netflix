'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {}

  Subscription.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      plan_id: { type: DataTypes.INTEGER, allowNull: false },
      start_at: { type: DataTypes.DATE, allowNull: false },
      end_at: { type: DataTypes.DATE },
      status: { type: DataTypes.ENUM('active', 'expired', 'canceled'), defaultValue: 'active' },
    },
    {
      sequelize,
      modelName: 'Subscription',
      tableName: 'subscriptions',
      underscored: true,
       createdAt:'created_at',
      updatedAt: false
    }
  );

  return Subscription;
};
