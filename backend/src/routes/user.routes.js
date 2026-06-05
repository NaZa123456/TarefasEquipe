const { Router } = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = Router();

router.use(authenticate);
router.get("/me", userController.getProfile);
router.put("/me", userController.updateProfile);
router.get("/", userController.listUsers);

module.exports = router;
