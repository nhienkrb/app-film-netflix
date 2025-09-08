const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription-controller");
const { verifyToken } = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management APIs
 */

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken,isAdmin, subscriptionController.getAllSubscriptions);

/**
 * @swagger
 * /subscriptions/{id}:
 *   get:
 *     summary: Get subscription by ID
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The subscription ID
 *     responses:
 *       200:
 *         description: Subscription found
 *       404:
 *         description: Subscription not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", verifyToken,isAdmin, subscriptionController.getSubscriptionById);

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - plan_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               plan_id:
 *                 type: integer
 *                 example: 2
 *               start_at:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-07"
 *               end_at:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-07"
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken,isAdmin, subscriptionController.createSubscription);

/**
 * @swagger
 * /subscriptions/{id}:
 *   put:
 *     summary: Update subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_id:
 *                 type: integer
 *                 example: 3
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-07"
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *       404:
 *         description: Subscription not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id", verifyToken,isAdmin, subscriptionController.updateSubscription);

/**
 * @swagger
 * /subscriptions/{id}:
 *   delete:
 *     summary: Delete subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The subscription ID
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       404:
 *         description: Subscription not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", verifyToken,isAdmin, subscriptionController.deleteSubscription);

module.exports = router;