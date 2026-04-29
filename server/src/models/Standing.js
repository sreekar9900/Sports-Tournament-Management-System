const mongoose = require("mongoose");

const standingSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    played: {
      type: Number,
      default: 0
    },
    won: {
      type: Number,
      default: 0
    },
    lost: {
      type: Number,
      default: 0
    },
    draw: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    scoreFor: {
      type: Number,
      default: 0
    },
    scoreAgainst: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

standingSchema.index({ tournament: 1, team: 1 }, { unique: true });

module.exports = mongoose.model("Standing", standingSchema);
