const services = require("../services/auth-service");
const {
  internalServerError,
  badRequest,
} = require("../middlewares/handleError");
const { email, password, display_name } = require("../helpers/joi_schema");
const joi = require("joi");
const register = async (req, res) => {
  try {
    const { error } = joi.object({ email, password,display_name }).validate(req.body);
   if (error) { 
      return badRequest(error.details[0]?.message,res);
    }
    const user = await services.registerService(req.body);
    if (user) {
      return res
        .status(201)
        .json({ data: user, message: "User registered successfully" });
    } else {
      return res
        .status(404)
        .json({ data: user, message: "User already exists" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ err: -1, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { error } = joi.object({ email, password }).validate(req.body);
    if (error) { 
      return badRequest(error.details[0]?.message,res);
    }
    const user = await services.loginService(req.body);
    if (user) {
      return res
        .status(201)
        .json({ data: user, message: "User login successfully" });
    } else {
      return res.status(404).json({ data: user, message: "User not found or Password incorrect" });
    }
  } catch (error) {
    console.error("LoginController error: " + error.message);
    return internalServerError(res);
  }
};

module.exports = {
  register,
  login,
};
