const Tournament = require("../models/Tournament");
const Registration = require("../models/Registration");
const Team = require("../models/Team");
const Match = require("../models/Match");
const Standing = require("../models/Standing");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { generateSchedule } = require("../services/schedulingService");
const { recalculateStandings } = require("../services/standingsService");

const validateTournamentPayload = ({ name, sportType, format, startDate, endDate }) => {
  if (!name || !sportType || !format || !startDate || !endDate) {
    throw new ApiError(400, "All tournament fields are required");
  }

  if (!["league", "knockout"].includes(format)) {
    throw new ApiError(400, "Format must be either league or knockout");
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new ApiError(400, "Start date must be before or equal to end date");
  }
};

const createTournament = asyncHandler(async (req, res) => {
  validateTournamentPayload(req.body);

  const tournament = await Tournament.create({
    ...req.body,
    createdBy: req.user._id
  });

  const io = req.app.get("io");
  if (io) {
    io.emit("tournament_created", {
      tournament,
      message: `A new tournament "${tournament.name}" has been created!`
    });
  }

  res.status(201).json(tournament);
});

const getTournaments = asyncHandler(async (req, res) => {
  const tournaments = await Tournament.find()
    .populate("createdBy", "name email")
    .sort({ startDate: 1 });

  res.json(tournaments);
});

const getTournamentById = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!tournament) {
    throw new ApiError(404, "Tournament not found");
  }

  res.json(tournament);
});

const updateTournament = asyncHandler(async (req, res) => {
  validateTournamentPayload(req.body);

  const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tournament) {
    throw new ApiError(404, "Tournament not found");
  }

  res.json(tournament);
});

const deleteTournament = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    throw new ApiError(404, "Tournament not found");
  }

  await Promise.all([
    tournament.deleteOne(),
    Registration.deleteMany({ tournament: req.params.id }),
    Match.deleteMany({ tournament: req.params.id }),
    Standing.deleteMany({ tournament: req.params.id })
  ]);

  res.json({ message: "Tournament deleted successfully" });
});

const registerTeamToTournament = asyncHandler(async (req, res) => {
  const { teamId } = req.body;
  const tournament = await Tournament.findById(req.params.id);

  if (!teamId) {
    throw new ApiError(400, "teamId is required");
  }

  if (!tournament) {
    throw new ApiError(404, "Tournament not found");
  }

  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  if (req.user.role === "manager" && team.manager.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Managers can only register their own teams");
  }

  const registration = await Registration.create({
    tournament: req.params.id,
    team: teamId
  });

  res.status(201).json(registration);
});

const getTournamentTeams = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({
    tournament: req.params.id,
    status: "registered"
  }).populate({
    path: "team",
    populate: {
      path: "manager",
      select: "name email"
    }
  });

  res.json(registrations);
});

const scheduleTournamentMatches = asyncHandler(async (req, res) => {
  const matches = await generateSchedule(req.params.id);
  await recalculateStandings(req.params.id);
  res.status(201).json(matches);
});

const getTournamentMatches = asyncHandler(async (req, res) => {
  const matches = await Match.find({ tournament: req.params.id })
    .populate("teamA", "name")
    .populate("teamB", "name")
    .populate("winner", "name")
    .sort({ scheduledAt: 1, createdAt: 1 });

  res.json(matches);
});

const getTournamentStandings = asyncHandler(async (req, res) => {
  const standings = await recalculateStandings(req.params.id);
  res.json(standings);
});

module.exports = {
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
};
