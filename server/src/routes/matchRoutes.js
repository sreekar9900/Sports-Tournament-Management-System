const express = require("express");
const { updateMatchScore, predictMatchOutcome } = require("../services/matchService");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.put("/:id/score", authMiddleware, roleMiddleware("admin"), updateMatchScore);
router.get("/:id/predict", predictMatchOutcome);

module.exports = router;
