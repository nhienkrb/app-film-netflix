const router = require("express").Router();
const favoriteController = require("../controllers/favorite-controller");
const { verifyToken } = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorite movies APIs
 */

/**
 * @swagger
 * /favorites/user/{userId}:
 *   get:
 *     summary: Get all favorite movies of a user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of favorite movies
 */
router.get("/user/:userId", verifyToken, favoriteController.getFavoritesByUser);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add movie to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - movieId
 *             properties:
 *               userId:
 *                 type: integer
 *               movieId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Movie added to favorites
 */
router.post("/", verifyToken, favoriteController.addFavorite);

/**
 * @swagger
 * /favorites:
 *   delete:
 *     summary: Remove movie from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - movieId
 *             properties:
 *               userId:
 *                 type: integer
 *               movieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie removed from favorites
 */
router.delete("/", verifyToken, favoriteController.removeFavorite);

/**
 * @swagger
 * /favorites/check:
 *   get:
 *     summary: Check if movie is favorite
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Check favorite status
 */
router.get("/check", verifyToken, favoriteController.isFavorite);

module.exports = router;