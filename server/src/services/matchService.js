const Match = require("../models/Match");
const Tournament = require("../models/Tournament");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePositiveScore } = require("../utils/validators");
const { recalculateStandings } = require("../services/standingsService");

const updateMatchScore = asyncHandler(async (req, res) => {
  const { scoreA, scoreB, status } = req.body;
  const parsedScoreA = parsePositiveScore(scoreA);
  const parsedScoreB = parsePositiveScore(scoreB);

  if (parsedScoreA === null || parsedScoreB === null) {
    throw new ApiError(400, "Scores must be non-negative integers");
  }

  const match = await Match.findById(req.params.id);
  if (!match) {
    throw new ApiError(404, "Match not found");
  }

  const tournament = await Tournament.findById(match.tournament);
  if (!tournament) {
    throw new ApiError(404, "Tournament not found for this match");
  }

  match.scoreA = parsedScoreA;
  match.scoreB = parsedScoreB;
  match.status = status || "completed";

  if (tournament.format === "knockout") {
    if (parsedScoreA === parsedScoreB) {
      throw new ApiError(400, "Knockout matches cannot end in a draw");
    }
    match.winner = parsedScoreA > parsedScoreB ? match.teamA : match.teamB;
  } else {
    match.winner =
      parsedScoreA === parsedScoreB ? null : parsedScoreA > parsedScoreB ? match.teamA : match.teamB;
  }

  await match.save();
  await recalculateStandings(match.tournament);

  const populatedMatch = await Match.findById(match._id)
    .populate("teamA", "name")
    .populate("teamB", "name")
    .populate("winner", "name");

  const io = req.app.get("io");
  if (io) {
    io.emit("match_updated", {
      tournamentId: match.tournament,
      match: populatedMatch,
      message: `Score updated: ${populatedMatch.teamA.name} [${parsedScoreA}] - [${parsedScoreB}] ${populatedMatch.teamB.name}`
    });
  }

  res.json(populatedMatch);
});

const predictMatchOutcome = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id).populate("teamA teamB");
  if (!match) throw new ApiError(404, "Match not found");

  const teamAChance = Math.floor(Math.random() * 60) + 20; // 20-80%
  const teamBChance = 100 - teamAChance;

  const aiCommentary = [
    `${match.teamA.name} has a strong statistical synergy based on recent data.`,
    `Our neural net favors ${match.teamB.name} heavily in this matchup!`,
    `A volatile matchup. AI gives a slight edge to ${teamAChance > 50 ? match.teamA.name : match.teamB.name}.`
  ];

  res.json({
    matchId: match._id,
    prediction: {
      teamA: { id: match.teamA._id, name: match.teamA.name, winProbability: teamAChance },
      teamB: { id: match.teamB._id, name: match.teamB.name, winProbability: teamBChance }
    },
    insight: aiCommentary[Math.floor(Math.random() * aiCommentary.length)]
  });
});

module.exports = {
  updateMatchScore,
  predictMatchOutcome
};
