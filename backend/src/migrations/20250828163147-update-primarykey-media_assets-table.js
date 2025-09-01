"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Xóa cột id (nếu đang có)
    await queryInterface.removeColumn("media_assets", "id");

    // 2. Thêm public_id làm khóa chính
    await queryInterface.addColumn("media_assets", "public_id", {
      type: Sequelize.STRING(50),
      allowNull: false,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback
    await queryInterface.removeColumn("media_assets", "public_id");

    await queryInterface.addColumn("media_assets", "id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },
};
