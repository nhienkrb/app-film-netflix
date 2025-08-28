const genreService = require("../services");
const {
  internalServerError,
  badRequest,
  notFound,
} = require("../middlewares/handleError");
const joi = require("joi");
const { name } = require("../helpers/joi_schema");

const getGenre = async (req, res) => {
  const genreId = await req.params.id;
  const genre = await genreService.getOne(genreId);
  if (!genre) return notFound(`Genre with id ${genreId} not found`, res);
  return res.status(200).json({ data: genre, message: "Successfully" });
};

const getAllGenre = async (req, res) => {
  const genres = await genreService.getAll();
    if (genres.length === 0) return notFound(`Genre null`, res);
  return res.status(200).json({ data: genres, message: "Successfully" });
};

const deleteGenre = async (req, res) => {
  const genreId = await req.params.id;
  const result = await genreService.deleteGenre(genreId);
  if (!result) return res.status(404).json({ message: "Genre not found" });
  return res.json({ message: "Genre deleted successfully" });
};

const createGenre = async (req, res) => {
  try {
    const { error } = joi.object({ name }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const GenreData = req.body;
    const newGenre = await genreService.createGenre(GenreData);
    return res.status(201).json({
      success: true,
      message: "Genre created successfully",
      data: newGenre,
    });
  } catch (error) {
    console.error("Error at createGenre controller:", error.message);
    return internalServerError(error.message, res);
  }
};

const updateGenre = async (req, res) => {
  try {
    const { error } = joi.object({ name }).validate(req.body);
    if (error) {
      return badRequest(error.details[0]?.message, res);
    }
    const { id } = req.params;
    const GenreData = req.body;

    const updatedGenre = await genreService.updateGenre(id, GenreData);

    return res.status(200).json({
      success: true,
      message: "Genre updated successfully",
      data: updatedGenre,
    });
  } catch (error) {
    console.error("Error at updateGenre controller:", error.message);

    if (error.message.includes("not found")) {
      return notFound(error.message, res);
    }

    return internalServerError(error.message, res);
  }
};

module.exports = {
  getGenre,
  getAllGenre,
  deleteGenre,
  createGenre,
  updateGenre,
};
