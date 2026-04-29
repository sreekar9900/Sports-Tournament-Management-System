const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./src/models/User");
const Tournament = require("./src/models/Tournament");
const Team = require("./src/models/Team");
const Match = require("./src/models/Match");
const Standing = require("./src/models/Standing");
const Registration = require("./src/models/Registration");

const { scheduleTournamentMatches } = require("./src/services/tournamentService"); // to generate fixtures
const { recalculateStandings } = require("./src/services/standingsService");

dotenv.config();

const clearDB = async () => {
  await User.deleteMany({});
  await Tournament.deleteMany({});
  await Team.deleteMany({});
  await Match.deleteMany({});
  await Standing.deleteMany({});
  await Registration.deleteMany({});
};

const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sports_tournament");
    console.log("Connected to MongoDB. Starting database seed...");

    await clearDB();

    console.log("Database cleared.");

    // 1. Create Core Users
    const passwordHash = await bcrypt.hash("password123", 10);
    const admin = await User.create({ name: "College Admin", email: "admin@college.edu", password: passwordHash, role: "admin" });
    const manager1 = await User.create({ name: "Team Manager One", email: "manager1@college.edu", password: passwordHash, role: "manager" });
    const manager2 = await User.create({ name: "Team Manager Two", email: "manager2@college.edu", password: passwordHash, role: "manager" });
    const manager3 = await User.create({ name: "Team Manager Three", email: "manager3@college.edu", password: passwordHash, role: "manager" });
    const spectator = await User.create({ name: "College Student", email: "student@college.edu", password: passwordHash, role: "spectator" });

    // 2. Create Teams
    const teamA = await Team.create({ name: "CS Engineering", manager: manager1._id, contact_info: "cs@college.edu", players: [{name: "Alice", jerseyNumber: 1}, {name: "Bob", jerseyNumber: 2}] });
    const teamB = await Team.create({ name: "Mechanical Dept", manager: manager2._id, contact_info: "mech@college.edu", players: [{name: "Charlie", jerseyNumber: 10}, {name: "Dave", jerseyNumber: 11}] });
    const teamC = await Team.create({ name: "Business School", manager: manager3._id, contact_info: "biz@college.edu", players: [{name: "Eve", jerseyNumber: 7}, {name: "Frank", jerseyNumber: 8}] });
    const teamD = await Team.create({ name: "Medical Faculty", manager: manager1._id, contact_info: "med@college.edu", players: [{name: "Grace", jerseyNumber: 5}, {name: "Heidi", jerseyNumber: 9}] });

    // 3. Create Tournaments (matches specific text from documentation)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 14);

    const footballTourney = await Tournament.create({
      name: "Annual Football Tournament",
      sportType: "Football",
      format: "league",
      startDate,
      endDate,
      rules: "FIFA standard rules. Win=3pts, Draw=1pt.",
      createdBy: admin._id
    });

    const cricketTourney = await Tournament.create({
      name: "Inter-College Cricket Tournament",
      sportType: "Cricket",
      format: "knockout",
      startDate,
      endDate,
      rules: "T20 format rules apply.",
      createdBy: admin._id
    });

    const basketballTourney = await Tournament.create({
      name: "Campus Basketball Tournament",
      sportType: "Basketball",
      format: "league",
      startDate,
      endDate,
      rules: "FIBA rules apply.",
      createdBy: admin._id
    });

    // 4. Register Teams to Football Tournament
    await Registration.insertMany([
      { tournament: footballTourney._id, team: teamA._id },
      { tournament: footballTourney._id, team: teamB._id },
      { tournament: footballTourney._id, team: teamC._id },
      { tournament: footballTourney._id, team: teamD._id }
    ]);

    // 5. Schedule Matches Automatically (as required by "Workflow" step 2)
    // We can simulate calling the auto-scheduler from tournamentService
    // To do that, we mock req, res for the controller, but better to bypass
    // We will just do it cleanly right here or use the generator.
    
    // Manual Generation for Football (League)
    const teamsList = [teamA._id, teamB._id, teamC._id, teamD._id];
    let matchDocs = [];
    for (let i = 0; i < teamsList.length; i++) {
        for (let j = i + 1; j < teamsList.length; j++) {
            matchDocs.push({
                tournament: footballTourney._id,
                round: "League Round",
                teamA: teamsList[i],
                teamB: teamsList[j],
                status: "scheduled"
            });
        }
    }
    const insertedMatches = await Match.insertMany(matchDocs);

    // 6. Simulate Scores for a few matches to show Leaderboard generator
    const match1 = insertedMatches[0]; // A vs B
    match1.scoreA = 2;
    match1.scoreB = 1;
    match1.winner = teamA._id;
    match1.status = "completed";
    await match1.save();

    const match2 = insertedMatches[1]; // A vs C
    match2.scoreA = 0;
    match2.scoreB = 0;
    match2.winner = null;
    match2.status = "completed";
    await match2.save();

    // Generate Standings automatically through the service
    await recalculateStandings(footballTourney._id);

    // Pre-populate Cricket and Basketball with teams but no played matches yet
    await Registration.insertMany([
        { tournament: cricketTourney._id, team: teamA._id },
        { tournament: cricketTourney._id, team: teamB._id }
    ]);
    await Registration.insertMany([
        { tournament: basketballTourney._id, team: teamC._id },
        { tournament: basketballTourney._id, team: teamD._id }
    ]);

    console.log("Seeding complete!");
    console.log("Admin Email:", admin.email);
    console.log("Password: password123");
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

runSeeder();
