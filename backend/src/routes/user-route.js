const { verifyToken } = require('../middlewares/verify_token');
const userController = require('../controllers');
const { isAdmin } = require('../middlewares/verify_roles');
const route = require('express').Router();
// route.get('/user',verifyToken,isAdmin,userController.getUser) // check role isAmin
route.get('/user',verifyToken,userController.getUser)
module.exports = route;