const { verifyToken } = require('../middlewares/verify_token');
const userController = require('../controllers');
const { isAdmin } = require('../middlewares/verify_roles');
const route = require('express').Router();
// route.get('/user',verifyToken,isAdmin,userController.getUser) // check role isAmin
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get  user  
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
route.get('/user',verifyToken,userController.getUser)

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized only admin
 */
route.get('/user/all', verifyToken, userController.getAllUser);


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete User
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
route.delete("/user/:id", verifyToken, userController.deleteUser);


/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - display_name
 *               - email
 *               - password_hash
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 example: "vana@example.com"
 *               password_hash:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
route.post("/user", verifyToken, userController.createUser);


/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update User
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: "Nguyen Van B"
 *               email:
 *                 type: string
 *                 example: "vanb@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
route.put("/user/:id", verifyToken, userController.updateUser);


module.exports = route;