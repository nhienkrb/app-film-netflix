const viewHistoryService = require("../services/viewHistory-service");
const { validateFieldViewHistory } = require("../helpers/joi_schema");
const { badRequest } = require("../middlewares/handleError");
const getTrackingMovie = async (req, res) => {
  try {
    const userID = await req.user.id;
    const viewHistory = await viewHistoryService.getAllMovieUserTracking(
      userID
    );
    return res.status(200).json({ data: viewHistory, message: "Successfully" });
  } catch (error) {
    console.error("Error getting tracking movie:", error);
    throw error;
  }
};

const createTrackingMovie = async (req, res) => {
  try {
    const { error } = validateFieldViewHistory.validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);
    const userID = await req.user.id;
    const dataViewHistory = req.body;
    const viewHistory = await viewHistoryService.create(
      userID,
      dataViewHistory
    );
    return res.status(200).json({ data: viewHistory, message: "Successfully" });
  } catch (error) {
    console.error("Error creating tracking movie:", error);
    throw error;
  }
};

const deleteTrackingMovie = async (req, res) => {
  try {
    const userId = req.user.id;
    const movieId = req.params.movieId;
    const result = await viewHistoryService.remove(userId, movieId);

    return res.status(200).json({
      data: result,
      message: "Successfully deleted movie from history",
    });
  } catch (error) {
    console.error("Error deleting tracking movie:", error);
    return badRequest("Internal Server Error", res);
  }
};

module.exports = { getTrackingMovie, createTrackingMovie, deleteTrackingMovie };
