const authRoute = require("./auth-route");
const userRoute = require("./user-route");
const profileRoute = require("./profile-route");

const { notFoundRoute } = require("../middlewares/handleError");

const initRouter = (app) => {
  app.use("/api/v1", authRoute);
  app.use("/api/v1", userRoute);
  app.use("/api/v1", profileRoute);
  return app.use(notFoundRoute);
};

module.exports= initRouter; 