const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");

const passwordHash = async (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const registerService = async ({ email, password, display_name }) => {
  const t = await db.sequelize.transaction();
  try {
    const [user, created] = await db.User.findOrCreate({
      where: { email: email },
      defaults: {
        email: email,
        password_hash: await passwordHash(password),
        display_name: display_name,
      },
      transaction: t,
    });
    if (!created) {
      await t.rollback();
      return "";
    } // email exist
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    await t.commit();
    return token;
  } catch (error) {
    await t.rollback();
    throw new Error(error.message);
  }
};

const loginService = async ({ email, password }) => {
  try {
    const user = await db.User.findOne({
      where: { email: email },
      raw: true,
    });
    if (!user) {
      return ""; // Email không tồn tại
    }
    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      return null; // Mật khẩu không đúng
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    return token;
  } catch (error) {
    console.error("LoginService error: " + error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  registerService,
  loginService,
};
