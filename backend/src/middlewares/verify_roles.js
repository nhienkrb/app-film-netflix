const jwt = require("jsonwebtoken");
const userService = require("../services/user-service");
const roles = require('../enums')
const { badRequest, forbiddenRequest } = require("./handleError");

const isAdmin = async (req, res, next) => {
  const { role, id: userID } = req.user; // Token decoded { id: 5, role: 1, iat: 1755710922, exp: 1756142922 }
  if (!role) {
    return badRequest("User not found", res);
  }
  const user = await userService.getOne(userID);
  if (user.role !== roles.Roles.VIEWER) {
    return forbiddenRequest("You do not have permission", res);
  }
  next();
};
module.exports = { isAdmin };
