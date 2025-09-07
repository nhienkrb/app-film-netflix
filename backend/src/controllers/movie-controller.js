const {
  badRequest,
  notFound,
  internalServerError,
} = require("../middlewares/handleError");
const movieService = require("../services/movie-service");
const joi = require("joi");

const movieSchema = joi.object({
  title: joi.string().min(1).max(255),
  description: joi.string().allow(""),
  // poster_url: joi.string().allow(""),
  duration_min: joi.number().integer().min(1),
  release_year: joi.number().integer().max(new Date().getFullYear()),
  age_rating: joi.string().valid("G", "PG", "PG-13", "R", "NC-17"),
  link_ytb: joi.string().allow(""),
  genre_id: joi.number().integer(),
  type: joi.string().valid("trailer", "full"),
  // movie_url: joi.string().allow(""),
  quality: joi.string().allow("").valid("SD", "HD", "FHD", "UHD"),
});

const getAllMovies = async (req, res) => {
  const movies = await movieService.getAll();
  return res.status(200).json({ data: movies, message: "Successfully" });
};

const getOneMovie = async (req, res) => {
  const movieId = req.params.id;
  const movie = await movieService.getOneById(movieId);
  if (!movie) {
    return notFound("Movie not found!", res);
  }
  return res.status(200).json({ data: movie, message: "Successfully" });
};

const getMoviesByName = async (req,res)=>{
  const name = req.params.name;
  const movies = await movieService.getOneByName(name);
  if(!movies || movies.length === 0) return notFound("Movie not found!",res);
  return res.status(200).json({data:movies, message:"Successfully"});
}


const getMoviesByTop10 = async (req,res)=>{
  const movies = await movieService.getTop10ByViews();
  return res.status(200).json({data:movies, message:"Successfully"});
}

const createMovie = async (req, res) => {
  try {
    const { error } = movieSchema.validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);

    const poster = req.files?.poster_url?.[0];
    const movieFile = req.files?.movie_url?.[0];

    if (!poster) return badRequest("Poster file is required", res);

    const movieData = {
      ...req.body, 
      poster_url: poster.path, // path local, sẽ upload lên Cloudinary trong service
      movie_url: movieFile ? movieFile.path : null,
    };

    const newMovie = await movieService.create(movieData);

    return res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: newMovie,
    });
  } catch (error) {
    console.error("Error at createMovie controller:", error.message);
    return internalServerError(error.message, res);
  }
};

const updateMovie = async (req, res) => {
  try {
    const { error } = movieSchema.validate(req.body);
    if (error) return badRequest(error.details[0]?.message, res);

    const { id } = req.params;
    const updatedMovie = await movieService.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Error at updateMovie controller:", error.message);
    if (error.message.includes("not found")) {
      return notFound(error.message, res);
    }
    return internalServerError(error.message, res);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await movieService.remove(id);
    if (!result) return notFound("Movie not found!", res);
    return res.json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error at deleteMovie controller:", error.message);
    return internalServerError(error.message, res);
  }
};

module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByName,
  getMoviesByTop10
};
