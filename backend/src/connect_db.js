const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("cinehub_lite", "root", "123456", {
  host: "localhost",   // hoặc IP server
  dialect: "mysql",
  logging: false,      // tắt log SQL
});

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối thành công MySQL với Sequelize!");
  } catch (error) {
    console.error("❌ Kết nối thất bại:", error);
  }
};
module.exports = connectionDatabase;
