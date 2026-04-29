const Team = require("../models/Team");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const createTeam = asyncHandler(async (req, res) => {
  const { name, players = [] } = req.body;

  if (!name) {
    throw new ApiError(400, "Team name is required");
  }

  const team = await Team.create({
    name,
    players,
    manager: req.user._id
  });

  res.status(201).json(team);
});

const getMyTeams = asyncHandler(async (req, res) => {
  const teams =
    req.user.role === "admin"
      ? await Team.find().populate("manager", "name email")
      : await Team.find({ manager: req.user._id }).populate("manager", "name email");

  res.json(teams);
});

const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id).populate("manager", "name email");
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  res.json(team);
});

const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  if (req.user.role !== "admin" && team.manager.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own teams");
  }

  team.name = req.body.name || team.name;
  team.players = Array.isArray(req.body.players) ? req.body.players : team.players;
  await team.save();

  res.json(team);
});

module.exports = {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam
};
