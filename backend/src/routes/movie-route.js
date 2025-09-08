const route = require('express').Router();
const { verifyToken } = require('../middlewares/verify_token');
const movieController = require('../controllers/movie-controller');
const upload = require('../middlewares/upload');
const { isAdmin } = require("../middlewares/verify_roles");

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management APIs
 */
/**
 * @swagger
 * /movies/top10:
 *   get:
 *     summary: Get Movie by top10
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Movies found
 *       401:
 *         description: Unauthorized
 */
route.get("/top10", movieController.getMoviesByTop10);


/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies
 *       401:
 *         description: Unauthorized
 */
route.get("/", verifyToken, movieController.getAllMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get Movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Movie ID
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized isAdmin
 */
route.get("/:id", verifyToken,isAdmin, movieController.getOneMovie);


/**
 * @swagger
 * /movies/search/{name}:
 *   get:
 *     summary: Get Movie by name
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The Movie name
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 */
route.get("/search/:name", movieController.getMoviesByName);



/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - genre_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Movie Title"
 *               description:
 *                 type: string
 *                 example: "Description"
 *               poster_url:
 *                 type: string
 *                 example: "https://example.com/poster.jpg"
 *               movie_url:
 *                 type: string
 *                 example: "https://example.com/movie.mp4"
 *               genre_id:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 example: "HD"
 *               quality:
 *                 type: string
 *                 example: "1080p"
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
route.post("/", verifyToken,isAdmin, upload.fields([
    { name: "poster_url", maxCount: 1 },
    { name: "movie_url", maxCount: 1 },
  ]), movieController.createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               description:
 *                 type: string
 *                 example: "Updated Description"
 *               poster_url:
 *                 type: string
 *                 example: "https://example.com/newposter.jpg"
 *               movie_url:
 *                 type: string
 *                 example: "https://example.com/newmovie.mp4"
 *               genre_id:
 *                 type: integer
 *                 example: 2
 *               type:
 *                 type: string
 *                 example: "4K"
 *               quality:
 *                 type: string
 *                 example: "2160p"
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
route.put("/:id", verifyToken,isAdmin, movieController.updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 */
route.delete("/:id", verifyToken,isAdmin, movieController.deleteMovie);

module.exports = route;