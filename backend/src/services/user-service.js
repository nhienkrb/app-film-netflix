const db = require("../models");
const bcrypt = require('bcryptjs');


const passwordHash = async (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const getOne = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password_hash"] },
      include: [{ model: db.Profile, as: "profile" }],
    });
    return user ? user : "";
  } catch (error) {
    console.error("Error fetching user:", error.message);
  }
};

const getAll = async () => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password_hash"] },
      include: [{ model: db.Profile, as: "profile" }],
    });
    return users;
  } catch (error) {
    console.error(
      "Error fetching users at method getAll, file user-service.js: " +
        error.message
    );
  }
};

const deleteUser = async (userId) => {
  const t = await db.sequelize.transaction();
  try {
    const user = await db.User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      throw new Error(`User with id ${userId} not found`);
    }

    await user.destroy({ transaction: t });
    await t.commit();

    return { message: "User deleted successfully" };
  } catch (error) {
    await t.rollback();
    console.error("Error at deleteUser user-service.js:", error.message);
    throw error;
  }
};


const createUser = async (userData) => {
  const t = await db.sequelize.transaction();
  try {
    const password_hash = await passwordHash(userData.password);
    const newUser = await db.User.create({...userData, password_hash}, { transaction: t });
    await t.commit();
    return newUser;
  } catch (error) {
    await t.rollback();
    console.error("Error at createUser user-service.js:", error.message);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  const t = await db.sequelize.transaction();
  try {
    const user = await db.User.findByPk(userId, { transaction: t, attributes: {exclude:['password_hash']} });
    if (!user) {
      await t.rollback(); // rollback luôn
      throw new Error(`User with id ${userId} not found`);
    }

    await user.update(userData, { transaction: t });
    await t.commit();

    return user; // user đã được cập nhật
  } catch (error) {
    await t.rollback();
    console.error("Error at updateUser user-service.js:", error.message);
    throw error;
  }
};



module.exports = { getOne, getAll, deleteUser, createUser, updateUser };
