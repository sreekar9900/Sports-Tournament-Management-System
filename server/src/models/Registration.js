const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["registered", "withdrawn"],
      default: "registered"
    }
  },
  {
    timestamps: true
  }
);

registrationSchema.index({ tournament: 1, team: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
