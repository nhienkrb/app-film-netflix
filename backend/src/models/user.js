const enums = require("../enums");
("use strict");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(60), allowNull: false },
      display_name: { type: DataTypes.STRING(100), allowNull: false },
      role: {
        type: DataTypes.ENUM.apply(
          null,
          enums.RolesValues || ["viewer", "admin"]
        ),
        defaultValue: "viewer",
      },
      status: {
        type: DataTypes.ENUM.apply(
          null,
          enums.StatusValues || ["active", "locked"]
        ),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true, // map created_at -> createdAt
    }
  );

  return User;
};
