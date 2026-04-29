const express = require("express");
const {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  registerTeamToTournament,
  getTournamentTeams,
  scheduleTournamentMatches,
  getTournamentMatches,
  getTournamentStandings
} = require("../services/tournamentService");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getTournaments);
router.get("/:id", getTournamentById);
router.get("/:id/teams", getTournamentTeams);
router.get("/:id/matches", getTournamentMatches);
router.get("/:id/standings", getTournamentStandings);
router.put("/:id/standings", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const Standing = require("../models/Standing");
  const { standings } = req.body;
  if (Array.isArray(standings)) {
    for (const standing of standings) {
      await Standing.findByIdAndUpdate(standing._id, {
        played: standing.played,
        won: standing.won,
        lost: standing.lost,
        draw: standing.draw,
        points: standing.points
      });
    }
  }
  res.json({ message: "Standings updated manually" });
});
router.post("/", authMiddleware, roleMiddleware("admin"), createTournament);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateTournament);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteTournament);
router.post(
  "/:id/register",
  authMiddleware,
  roleMiddleware("manager", "admin"),
  registerTeamToTournament
);
router.post(
  "/:id/schedule",
  authMiddleware,
  roleMiddleware("admin"),
  scheduleTournamentMatches
);

module.exports = router;
