const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { validate, registerSchema, loginSchema } = require("../middlewares/validate.middleware");

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
