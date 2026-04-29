import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import getErrorMessage from "../utils/getErrorMessage";

const initialPlayer = { name: "", jerseyNumber: "", position: "" };

const ManagerDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teamForm, setTeamForm] = useState({
    name: "",
    players: [{ ...initialPlayer }]
  });
  const [registrationForm, setRegistrationForm] = useState({
    teamId: "",
    tournamentId: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [teamsResponse, tournamentsResponse] = await Promise.all([
      api.get("/teams/my"),
      api.get("/tournaments")
    ]);

    setTeams(teamsResponse.data);
    setTournaments(tournamentsResponse.data);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadData();
      } catch (bootstrapError) {
        setError(getErrorMessage(bootstrapError));
      }
    };

    bootstrap();
  }, []);

  const handlePlayerChange = (index, field, value) => {
    setTeamForm((current) => ({
      ...current,
      players: current.players.map((player, playerIndex) =>
        playerIndex === index ? { ...player, [field]: value } : player
      )
    }));
  };

  const addPlayerRow = () => {
    setTeamForm((current) => ({
      ...current,
      players: [...current.players, { ...initialPlayer }]
    }));
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/teams", {
        name: teamForm.name,
        players: teamForm.players
          .filter((player) => player.name && player.jerseyNumber !== "")
          .map((player) => ({
            ...player,
            jerseyNumber: Number(player.jerseyNumber)
          }))
      });
      setTeamForm({
        name: "",
        players: [{ ...initialPlayer }]
      });
      setMessage("Team created successfully.");
      await loadData();
    } catch (createError) {
      setError(getErrorMessage(createError));
    }
  };

  const handleRegisterTeam = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post(`/tournaments/${registrationForm.tournamentId}/register`, {
        teamId: registrationForm.teamId
      });
      setMessage("Team registered successfully.");
    } catch (registerError) {
      setError(getErrorMessage(registerError));
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pt-4">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
             <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-indigo-300 uppercase bg-indigo-500/20 rounded-full border border-indigo-500/30">Team Management</span>
             <h1 className="text-3xl font-black tracking-tight text-white mb-2">Manager Operations Panel</h1>
             <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
               Create squads, maintain player lists, and register your teams for active tournaments.
             </p>
          </div>
          <div className="flex gap-4">
             <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-inner">
                <span className="text-3xl font-black text-indigo-400 mb-1">{teams.length}</span>
                <span className="text-xs font-semibold uppercase text-slate-300 tracking-wider">My Teams</span>
             </div>
             <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-inner">
                <span className="text-3xl font-black text-cyan-400 mb-1">{tournaments.length}</span>
                <span className="text-xs font-semibold uppercase text-slate-300 tracking-wider">Open Dockets</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Create Team Form */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col h-full">
           <div className="mb-6">
             <h2 className="text-xl font-bold text-slate-800 mb-1">Create Team Squad</h2>
             <p className="text-sm text-slate-500">Draft your players and register team basics.</p>
           </div>
           
           <form onSubmit={handleCreateTeam} className="flex flex-col flex-1 gap-6">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold text-slate-700">Team Franchise Name</label>
               <input
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                 placeholder="Enter team name"
                 value={teamForm.name}
                 onChange={(event) => setTeamForm((current) => ({ ...current, name: event.target.value }))}
                 required
               />
             </div>

             <div className="flex flex-col gap-4">
               <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Team Roster</h3>
               <div className="flex flex-col gap-3">
                 {teamForm.players.map((player, index) => (
                   <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100" key={index}>
                     <input
                       className="sm:col-span-6 w-full min-w-0 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                       placeholder="Player Name"
                       value={player.name}
                       onChange={(event) => handlePlayerChange(index, "name", event.target.value)}
                     />
                     <input
                       className="sm:col-span-2 w-full min-w-0 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                       min="0"
                       type="number"
                       placeholder="Jersey #"
                       value={player.jerseyNumber}
                       onChange={(event) => handlePlayerChange(index, "jerseyNumber", event.target.value)}
                     />
                     <input
                       className="sm:col-span-4 w-full min-w-0 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                       placeholder="Position"
                       value={player.position}
                       onChange={(event) => handlePlayerChange(index, "position", event.target.value)}
                     />
                   </div>
                 ))}
               </div>
               
               <button 
                 type="button" 
                 onClick={addPlayerRow}
                 className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2"
               >
                 + Add Another Player
               </button>
             </div>

             <div className="mt-auto pt-6">
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Confirm & Create Team
                </button>
             </div>
           </form>
        </div>

        {/* Tournament Registration */}
        <div className="flex flex-col gap-8">
           <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
             <div className="mb-6">
               <h2 className="text-xl font-bold text-slate-800 mb-1">Tournament Enroll</h2>
               <p className="text-sm text-slate-500">Admit a constructed team into a registered bracket.</p>
             </div>

             <form onSubmit={handleRegisterTeam} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Participating Team</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none"
                    value={registrationForm.teamId}
                    onChange={(event) => setRegistrationForm((current) => ({ ...current, teamId: event.target.value }))}
                    required
                  >
                    <option value="">Select a supervised team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Tournament Destination</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none"
                    value={registrationForm.tournamentId}
                    onChange={(event) => setRegistrationForm((current) => ({ ...current, tournamentId: event.target.value }))}
                    required
                  >
                    <option value="">Select open tournament</option>
                    {tournaments.map((tournament) => (
                      <option key={tournament._id} value={tournament._id}>{tournament.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 mt-2"
                >
                  Submit Registration
                </button>
             </form>
             
             {message && <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">{message}</div>}
             {error && <div className="mt-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm font-medium border border-rose-100">{error}</div>}
           </div>

           {/* Active Teams Summary */}
           <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-8 flex-1">
             <h2 className="text-lg font-bold text-indigo-950 mb-4">My Managed Rosters</h2>
             {teams.length === 0 ? (
                <p className="text-sm text-indigo-900/60 font-medium">You have not created any teams yet.</p>
             ) : (
                <ul className="flex flex-col gap-3">
                  {teams.map((team) => (
                    <li key={team._id} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm border border-indigo-50 gap-4">
                      <span className="font-bold text-slate-700 truncate">{team.name}</span>
                      <span className="flex-shrink-0 text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">{team.players.length} players</span>
                    </li>
                  ))}
                </ul>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;
