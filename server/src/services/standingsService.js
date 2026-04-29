const Match = require("../models/Match");
const Registration = require("../models/Registration");
const Standing = require("../models/Standing");
const Tournament = require("../models/Tournament");

const buildStandingsMap = (teamIds) => {
  const table = new Map();

  teamIds.forEach((teamId) => {
    table.set(teamId.toString(), {
      tournament: null,
      team: teamId,
      played: 0,
      won: 0,
      lost: 0,
      draw: 0,
      points: 0,
      scoreFor: 0,
      scoreAgainst: 0
    });
  });

  return table;
};

const recalculateStandings = async (tournamentId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament || tournament.format !== "league") {
    await Standing.deleteMany({ tournament: tournamentId });
    return [];
  }

  const registrations = await Registration.find({
    tournament: tournamentId,
    status: "registered"
  }).select("team");

  const teamIds = registrations.map((registration) => registration.team);
  const table = buildStandingsMap(teamIds);
  const matches = await Match.find({
    tournament: tournamentId,
    status: "completed"
  });

  matches.forEach((match) => {
    const teamA = table.get(match.teamA.toString());
    const teamB = table.get(match.teamB.toString());

    if (!teamA || !teamB) {
      return;
    }

    teamA.tournament = tournamentId;
    teamB.tournament = tournamentId;
    teamA.played += 1;
    teamB.played += 1;
    teamA.scoreFor += match.scoreA;
    teamA.scoreAgainst += match.scoreB;
    teamB.scoreFor += match.scoreB;
    teamB.scoreAgainst += match.scoreA;

    if (match.scoreA > match.scoreB) {
      teamA.won += 1;
      teamA.points += 3;
      teamB.lost += 1;
    } else if (match.scoreB > match.scoreA) {
      teamB.won += 1;
      teamB.points += 3;
      teamA.lost += 1;
    } else {
      teamA.draw += 1;
      teamB.draw += 1;
      teamA.points += 1;
      teamB.points += 1;
    }
  });

  await Standing.deleteMany({ tournament: tournamentId });

  const standings = Array.from(table.values()).map((entry) => ({
    ...entry,
    tournament: tournamentId
  }));

  if (standings.length > 0) {
    await Standing.insertMany(standings);
  }

  return Standing.find({ tournament: tournamentId })
    .populate("team", "name")
    .sort({ points: -1, scoreFor: -1, scoreAgainst: 1 });
};

module.exports = {
  recalculateStandings
};
