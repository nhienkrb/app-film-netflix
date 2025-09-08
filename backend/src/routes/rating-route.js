const route = require('express').Router();
const { createRating, removeRating, getAllByMovieId,updateRating } = require('../controllers/rating-controller');
const { verifyToken } = require('../middlewares/verify_token');
const { isAdmin } = require("../middlewares/verify_roles");

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Movie rating management APIs
 */

/**
 * @swagger
 * /ratings/{movie_id}:
 *   get:
 *     summary: Get all ratings for a movie
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *         example: 123
 *     responses:
 *       200:
 *         description: List of ratings for the movie
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
route.get('/:movie_id', getAllByMovieId);

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Create a new rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie_id
 *               - stars
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 example: 123
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great movie!"
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
route.post('/', verifyToken, createRating);


/**
 * @swagger
 * /ratings:
 *   put:
 *     summary: Update a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie_id
 *               - stars
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 example: 123
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Updated comment about the movie"
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Rating updated successfully"
 *                 newRating:
 *                   $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
route.put('/', verifyToken, updateRating);


/**
 * @swagger
 * /ratings:
 *   delete:
 *     summary: Remove a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie_id
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Rating removed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
route.delete('/', verifyToken,isAdmin, removeRating);

module.exports = route;