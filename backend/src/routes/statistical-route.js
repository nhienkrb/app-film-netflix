const router = require("express").Router();
const { verifyToken } = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");
const statistical = require("../controllers/statistical-controller");

/**
 * @swagger
 * tags:
 *   name: Statistical
 *   description: Statistical and analytics APIs
 */

/**
 * @swagger
 * /statistical/revenue:
 *   get:
 *     summary: Get total revenue
 *     tags: [Statistical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 revenue:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/revenue", verifyToken, isAdmin, statistical.getRevenue);

/**
 * @swagger
 * /statistical/revenue/monthly/{year}:
 *   get:
 *     summary: Get monthly revenue by year
 *     tags: [Statistical]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The year to get monthly revenue
 *     responses:
 *       200:
 *         description: Monthly revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: integer
 *                       revenue:
 *                         type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/revenue/monthly/:year", verifyToken, isAdmin, statistical.getMonthlyRevenue);

/**
 * @swagger
 * /statistical/revenue/top-rated:
 *   get:
 *     summary: Get top rated movies
 *     tags: [Statistical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top rated movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       avg_rating:
 *                         type: number
 *                       rating_count:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/revenue/top-rated", verifyToken, isAdmin, statistical.getTopRatedMovies);


module.exports = router;