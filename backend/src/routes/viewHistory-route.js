const express = require("express");
const viewHistoryController = require("../controllers/viewHistory-controller");
const router = express.Router();
const { verifyToken } = require("../middlewares/verify_token");

/**
 * @swagger
 * tags:
 *   name: ViewHistory
 *   description: API for managing view history
 */

/**
 * @swagger
 * /view-history:
 *   get:
 *     summary: Get user's viewing history
 *     description: Returns detailed information about a user's viewing history for a specific movie
 *     tags: [ViewHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success, returns viewing history information
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Viewing history not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "View history not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", verifyToken, viewHistoryController.getTrackingMovie);
/**
 * @swagger
 * /view-history:
 *   post:
 *     summary: Add a new view history entry
 *     tags: [ViewHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *               position_sec:
 *                 type: integer
 *     responses:
 *       201:
 *         description: View history created
 */
router.post("/", verifyToken,viewHistoryController.createTrackingMovie);

/**
 * @swagger
 * /view-history/{movieId}:
 *   delete:
 *     summary: Delete a view history entry
 *     tags: [ViewHistory]
 *     parameters:
 *       - in: path
 *         name: movieId   # phải trùng với route
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View history deleted
 */

router.delete("/:movieId",verifyToken ,viewHistoryController.deleteTrackingMovie);

module.exports = router;
