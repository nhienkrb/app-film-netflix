const authRoute = require("./auth-route");
const userRoute = require("./user-route");
const { notFoundRoute } = require("../middlewares/handleError");

const initRouter = (app) => {
  app.use("/api/v1", authRoute);
  app.use("/api/v1", userRoute);
  return app.use(notFoundRoute);
};

module.exports= initRouter;