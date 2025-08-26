const userService = require("../services");

const getUser = async (req, res) => {
  const userId = await req.user.id;
  const user = await userService.getOne(userId);
  return res.status(200).json({ data: user, message: "Successfully" });
};


module.exports = {
  getUser,
};
