"use strict";
/** @type {import('sequelize-cli').Migration} */
const enums = require("../enums");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password_hash: {
        type: Sequelize.STRING,
      },
      display_name: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM,
        values: enums.RolesValues,
        defaultValue: "viewer",
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: enums.StatusValues,
        defaultValue: "active",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
