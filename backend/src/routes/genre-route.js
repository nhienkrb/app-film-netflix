const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre-controller");
const { verifyToken } = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");
 
/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Genre management APIs
 */

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of genres
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, genreController.getAllGenre);

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Get genre by ID
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The genre ID
 *     responses:
 *       200:
 *         description: Genre found
 *       404:
 *         description: Genre not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", verifyToken,isAdmin, genreController.getGenre);

/**
 * @swagger
 * /genres:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Action"
 *     responses:
 *       201:
 *         description: Genre created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken,isAdmin, genreController.createGenre);

/**
 * @swagger
 * /genres/{id}:
 *   put:
 *     summary: Update genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Adventure"
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyToken,isAdmin, genreController.updateGenre);

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Delete genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The genre ID
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", verifyToken,isAdmin, genreController.deleteGenre);

module.exports = router;