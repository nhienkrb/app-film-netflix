const db = require("../models");

const getOne = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password_hash"] },
      include: [{model: db.Profile, as: "profile"}]
    });
    return user ? user : "";
  } catch (error) {
    console.error("Error fetching user:", error.message);
  }
};

module.exports = { getOne };
