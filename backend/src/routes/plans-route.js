const express = require("express");
const router = express.Router();
const plansController = require("../controllers/plans-controller");
const { verifyToken } = require("../middlewares/verify_token");

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Subscription plan management APIs
 */

/**
 * @swagger
 * /plans:
 *   get:
 *     summary: Get all plans
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of plans
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, plansController.getAllPlans);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     summary: Get plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The plan ID
 *     responses:
 *       200:
 *         description: Plan found
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", verifyToken, plansController.getPlanById);

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
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
 *               - price_per_month
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium"
 *               price_per_month:
 *                 type: number
 *                 example: 199000
 *               description:
 *                 type: string
 *                 example: "Full HD, 4 screens"
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, plansController.createPlan);

/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     summary: Update plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Standard"
 *               price_per_month:
 *                 type: number
 *                 example: 99000
 *               description:
 *                 type: string
 *                 example: "HD, 2 screens"
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyToken, plansController.updatePlan);

/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     summary: Delete plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       404:
 *         description: Plan not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", verifyToken, plansController.deletePlan);

module.exports = router;