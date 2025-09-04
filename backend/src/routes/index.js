const authRoute = require("./auth-route");
const userRoute = require("./user-route");
const profileRoute = require("./profile-route");
const genreRoute = require("./genre-route");
const movieRoute = require("./movie-route");
const viewHistoryRoute = require("./viewHistory-route");
const ratingRoute = require("./rating-route");

const { notFoundRoute } = require("../middlewares/handleError");

const initRouter = (app) => {
  app.use("/api/v1", authRoute);
  app.use("/api/v1", userRoute);
  app.use("/api/v1/genres", genreRoute);
  app.use("/api/v1/movies", movieRoute);
  app.use("/api/v1/view-history", viewHistoryRoute);
  app.use("/api/v1/ratings", ratingRoute);

  return app.use(notFoundRoute);
}; 

module.exports= initRouter; 