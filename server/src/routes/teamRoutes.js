const express = require("express");
const {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam
} = require("../services/teamService");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("manager", "admin"), createTeam);
router.get("/my", authMiddleware, roleMiddleware("manager", "admin"), getMyTeams);
router.get("/:id", authMiddleware, getTeamById);
router.put("/:id", authMiddleware, roleMiddleware("manager", "admin"), updateTeam);

module.exports = router;
