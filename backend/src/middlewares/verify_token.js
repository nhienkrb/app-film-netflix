const jwt = require("jsonwebtoken");
const { badRequest, forbiddenRequest } = require("./handleError");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return badRequest("Required Authorization", res);
  }
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return forbiddenRequest("forbidden", res);
    }
    req.user = user;
    next();
  });
};

module.exports = { verifyToken };
