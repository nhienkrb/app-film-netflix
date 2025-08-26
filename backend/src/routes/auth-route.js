const router = require("express").Router();
const controller = require("../controllers")

router.post("/auth/register",controller.register);
router.post("/auth/login",controller.login);


module.exports = router;
