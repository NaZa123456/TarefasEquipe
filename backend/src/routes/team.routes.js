const { Router } = require("express");
const teamController = require("../controllers/team.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validate, createTeamSchema } = require("../middlewares/validate.middleware");

const router = Router();

router.use(authenticate);
router.get("/", teamController.getTeams);
router.post("/", validate(createTeamSchema), teamController.createTeam);
router.put("/:id", validate(createTeamSchema), teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);
router.post("/:id/members", teamController.addMember);
router.delete("/:id/members/:userId", teamController.removeMember);

module.exports = router;
