const userService = require("../services/user-service");
const {
  internalServerError,
  badRequest,
} = require("../middlewares/handleError");
const joi = require("joi");
const { email, display_name, password } = require("../helpers/joi_schema");

const getUser = async (req, res) => {
  const userId = await req.user.id;
  const user = await userService.getOne(userId);
  return res.status(200).json({ data: user, message: "Successfully" });
};

const getAllUser = async (req, res) => {
  const users = await userService.getAll();
  return res.status(200).json({ data: users, message: "Successfully" });
};

const deleteUser = async (req, res) => {
  const userId = await req.params.id;
  const result = await userService.deleteUser(userId);
  if (!result) return res.status(404).json({ message: "User not found" });
  return res.json({ message: "User deleted successfully" });
};

const createUser = async (req, res) => {
  try {
      const { error } = joi.object({ email, display_name, password }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error at createUser controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// [PUT] /users/:id
const updateUser = async (req, res) => {
  try {
    const { error } = joi.object({ email, display_name }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const { id } = req.params;
    const userData = req.body;

    const updatedUser = await userService.updateUser(id, userData);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error at updateUser controller:", error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getUser,
  getAllUser,
  deleteUser,
  createUser,
  updateUser,
};
