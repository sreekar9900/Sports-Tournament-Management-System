const Match = require("../models/Match");
const Registration = require("../models/Registration");
const Tournament = require("../models/Tournament");
const ApiError = require("../utils/apiError");

const createLeagueSchedule = (teamIds) => {
  const matches = [];
  let round = 1;

  for (let i = 0; i < teamIds.length; i += 1) {
    for (let j = i + 1; j < teamIds.length; j += 1) {
      matches.push({
        round: `Round ${round}`,
        teamA: teamIds[i],
        teamB: teamIds[j]
      });
      round += 1;
    }
  }

  return matches;
};

const createKnockoutSchedule = (teamIds) => {
  if (teamIds.length % 2 !== 0) {
    throw new ApiError(400, "Knockout tournaments require an even number of teams");
  }

  const matches = [];
  for (let i = 0; i < teamIds.length; i += 2) {
    matches.push({
      round: "Round 1",
      teamA: teamIds[i],
      teamB: teamIds[i + 1]
    });
  }

  return matches;
};

const generateSchedule = async (tournamentId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new ApiError(404, "Tournament not found");
  }

  const registrations = await Registration.find({
    tournament: tournamentId,
    status: "registered"
  }).select("team");

  const teamIds = registrations.map((registration) => registration.team);
  if (teamIds.length < 2) {
    throw new ApiError(400, "At least two registered teams are required to schedule matches");
  }

  await Match.deleteMany({ tournament: tournamentId, status: "scheduled" });

  const fixtures =
    tournament.format === "league"
      ? createLeagueSchedule(teamIds)
      : createKnockoutSchedule(teamIds);

  const documents = fixtures.map((fixture, index) => ({
    tournament: tournamentId,
    round: fixture.round,
    teamA: fixture.teamA,
    teamB: fixture.teamB,
    scheduledAt: new Date(tournament.startDate.getTime() + index * 24 * 60 * 60 * 1000)
  }));

  await Match.insertMany(documents);

  return Match.find({ tournament: tournamentId })
    .populate("teamA", "name")
    .populate("teamB", "name")
    .sort({ scheduledAt: 1, createdAt: 1 });
};

module.exports = {
  generateSchedule
};
