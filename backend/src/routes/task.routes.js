const { Router } = require("express");
const taskController = require("../controllers/task.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate, createTaskSchema } = require("../middlewares/validate.middleware");

const router = Router();

router.use(authenticate);
router.get("/", taskController.getTasks);
router.get("/stats", taskController.getStats);
router.get("/:id", taskController.getTask);
router.post("/", validate(createTaskSchema), taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
