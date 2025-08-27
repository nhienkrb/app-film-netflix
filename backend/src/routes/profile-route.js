const { verifyToken } = require('../middlewares/verify_token');
const profileController = require('../controllers/profile-controller');
const route = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profile management APIs
 */

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The profile ID
 *     responses:
 *       200:
 *         description: Profile found
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized
 */
route.get('/profiles/:id', verifyToken, profileController.getProfile);

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new profile
 *     tags: [Profiles]
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
 *               - maturity_level
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Profile 1"
 *               maturity_level:
 *                 type: string
 *                 example: 
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
route.post('/profiles', verifyToken, profileController.createProfile);

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Update profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Profile Updated"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
route.put('/profiles/:id', verifyToken, profileController.updateProfile);

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Delete profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The profile ID
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized
 */
route.delete('/profiles/:id', verifyToken, profileController.deleteProfile);

module.exports = route;