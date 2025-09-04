const ratingService = require("../services/rating-service");
const { badRequest, notFound } = require("../middlewares/handleError");

const joi = require("joi");

const ratingSchema = joi.object({
  movie_id: joi.number().integer().required(),
  stars: joi.number().integer().min(1).max(5).required(),
  comment: joi.string().allow(null, ""),
});
const movie_id = joi.number().integer().required();

const getAllByMovieId = async (req, res) => {
  const movie_id = req.params.movie_id;
  const ratings = await ratingService.getAllByMovieId(movie_id);
  return res
    .status(200)
    .json({ err: 0, message: "Get all ratings successfully", data: ratings });
};

const createRating = async (req, res) => {
  try {
    const { err } = await ratingSchema.validateAsync(req.body);
    if (err) return badRequest(err.details[0].message, res);
    const userId = req.user.id;
    const data = {
      ...req.body,
      user_id: userId,
    };
    const newRating = await ratingService.create(data);

    return res
      .status(201)
      .json({ err: 0, message: "Create rating successfully", newRating });
  } catch (error) {
    return badRequest(error.message, res);
  }
};

const updateRating = async (req, res) => {
  try {
    const { err } = await ratingSchema.validateAsync(req.body);
    if (err) return badRequest(err.details[0].message, res);
    const userId = req.user.id;
    const data = {
      ...req.body,
      user_id: userId,
    };
    const newRating = await ratingService.update(data);
    return res
      .status(201)
      .json({ err: 0, message: "update rating successfully", newRating });
  } catch (error) {}
};
const removeRating = async (req, res) => {
  try {
    const { err } = await movie_id.validate(req.body);
    if (err) return badRequest(err.details[0].message, res);
    const userId = req.user.id;
    const data = {
      ...req.body,
      user_id: userId,
    };
    const newRating = await ratingService.remove(data);

    if (!newRating)
      return notFound("Rating not found or you are not the owner", res);
    return res
      .status(200)
      .json({ err: 0, message: "Remove rating successfully", newRating });
  } catch (error) {
    return badRequest(error.message, res);
  }
};

module.exports = { createRating, removeRating, getAllByMovieId,updateRating };
