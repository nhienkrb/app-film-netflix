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
 *     summary: Get all users demo 
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
route.get('/user',verifyToken,userController.getUser)
module.exports = route;