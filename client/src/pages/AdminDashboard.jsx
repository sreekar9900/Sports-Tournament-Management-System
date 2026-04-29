import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import AnalyticsPanel from "../components/AnalyticsPanel";
import getErrorMessage from "../utils/getErrorMessage";

const initialTournament = {
  name: "",
  sportType: "",
  format: "league",
  startDate: "",
  endDate: "",
  rules: ""
};

const AdminDashboard = () => {
  const [form, setForm] = useState(initialTournament);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [scoreForm, setScoreForm] = useState({});
  const [standingsForm, setStandingsForm] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTournaments = async () => {
    const response = await api.get("/tournaments");
    setTournaments(response.data);

    if (!selectedTournamentId && response.data.length > 0) {
      setSelectedTournamentId(response.data[0]._id);
    }
  };

  const loadMatchesAndStandings = async (tournamentId) => {
    if (!tournamentId) {
      setMatches([]);
      setStandings([]);
      return;
    }

    try {
      const [matchesRes, standingsRes] = await Promise.all([
        api.get(`/tournaments/${tournamentId}/matches`),
        api.get(`/tournaments/${tournamentId}/standings`)
      ]);
      setMatches(matchesRes.data);
      setStandings(standingsRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadTournaments();
      } catch (bootstrapError) {
        setError(getErrorMessage(bootstrapError));
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const syncData = async () => {
      try {
        await loadMatchesAndStandings(selectedTournamentId);
      } catch (matchError) {
        setError(getErrorMessage(matchError));
      }
    };

    syncData();
  }, [selectedTournamentId]);

  const handleTournamentChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleCreateTournament = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/tournaments", form);
      setForm(initialTournament);
      setMessage("Tournament created successfully.");
      await loadTournaments();
    } catch (createError) {
      setError(getErrorMessage(createError));
    }
  };

  const handleSchedule = async () => {
    setError("");
    setMessage("");

    try {
      await api.post(`/tournaments/${selectedTournamentId}/schedule`);
      setMessage("Matches scheduled successfully.");
      await loadMatchesAndStandings(selectedTournamentId);
    } catch (scheduleError) {
      setError(getErrorMessage(scheduleError));
    }
  };

  const handleScoreChange = (matchId, field, value) => {
    setScoreForm((current) => ({
      ...current,
      [matchId]: {
        ...current[matchId],
        [field]: value
      }
    }));
  };

  const handleScoreSubmit = async (matchId) => {
    setError("");
    setMessage("");

    try {
      const match = matches.find(m => m._id === matchId);
      const payload = scoreForm[matchId] || {};
      await api.put(`/matches/${matchId}/score`, {
        scoreA: Number(payload.scoreA ?? match.scoreA),
        scoreB: Number(payload.scoreB ?? match.scoreB),
        status: payload.status ?? match.status
      });
      setMessage("Score and status saved successfully.");
      await loadMatchesAndStandings(selectedTournamentId);
    } catch (scoreError) {
      setError(getErrorMessage(scoreError));
    }
  };

  const handleStandingsChange = (stdId, field, value) => {
    setStandingsForm((current) => ({
      ...current,
      [stdId]: {
        ...current[stdId],
        [field]: value
      }
    }));
  };

  const handleStandingsSubmit = async (stdId) => {
    setError("");
    setMessage("");
    try {
      const std = standings.find(s => s._id === stdId);
      const payload = standingsForm[stdId] || {};
      const newStandings = [{
        _id: stdId,
        played: Number(payload.played ?? std.played),
        won: Number(payload.won ?? std.won),
        draw: Number(payload.draw ?? std.draw),
        lost: Number(payload.lost ?? std.lost),
        points: Number(payload.points ?? std.points)
      }];
      await api.put(`/tournaments/${selectedTournamentId}/standings`, { standings: newStandings });
      setMessage("Standings updated manually");
      await loadMatchesAndStandings(selectedTournamentId);
    } catch(err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="dashboard-stack">
      <div className="section-banner">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Tournament Control Center</h1>
          <p className="muted">
            Configure tournaments, generate fixtures, and publish official score updates.
          </p>
        </div>
        <div className="banner-metrics">
          <div className="metric-pill">
            <strong>{tournaments.length}</strong>
            <span>Tournaments</span>
          </div>
          <div className="metric-pill">
            <strong>{matches.length}</strong>
            <span>Fixtures</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
      <div className="card card-elevated">
        <PageHeader
          title="Create Tournament"
          subtitle="Set the competition format, schedule window, and tournament rules."
        />
        <form className="stacked-form" onSubmit={handleCreateTournament}>
          <label>
            Tournament name
            <input name="name" value={form.name} onChange={handleTournamentChange} required />
          </label>
          <label>
            Sport type
            <input
              name="sportType"
              value={form.sportType}
              onChange={handleTournamentChange}
              required
            />
          </label>
          <label>
            Format
            <select name="format" value={form.format} onChange={handleTournamentChange}>
              <option value="league">League</option>
              <option value="knockout">Knockout</option>
            </select>
          </label>
          <label>
            Start date
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleTournamentChange}
              required
            />
          </label>
          <label>
            End date
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleTournamentChange}
              required
            />
          </label>
          <label>
            Rules
            <textarea name="rules" value={form.rules} onChange={handleTournamentChange} />
          </label>
          <button className="button" type="submit">
            Create Tournament
          </button>
        </form>
      </div>

      <div className="card card-elevated">
        <PageHeader
          title="Fixture and Results Management"
          subtitle="Generate match schedules and enter verified results."
        />
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <label className="flex-1 m-0 pointer-events-auto">
            Select tournament
            <select
              value={selectedTournamentId}
              onChange={(event) => setSelectedTournamentId(event.target.value)}
              className="mt-1"
            >
              <option value="">Choose one</option>
              {tournaments.map((tournament) => (
                <option key={tournament._id} value={tournament._id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </label>
          <button className="button secondary whitespace-nowrap mb-0" onClick={handleSchedule} type="button">
            Generate Schedule
          </button>
        </div>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fixture</th>
                <th className="!text-center">Status</th>
                <th className="!text-center">Team A Score</th>
                <th className="!text-center">Team B Score</th>
                <th className="!text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id}>
                  <td>
                    {match.teamA?.name} vs {match.teamB?.name}
                  </td>
                  <td className="!text-center align-middle">
                    <select
                      className="min-w-[110px] mx-auto text-sm block"
                      value={scoreForm[match._id]?.status ?? match.status}
                      onChange={(event) =>
                        handleScoreChange(match._id, "status", event.target.value)
                      }
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="!text-center align-middle">
                    <input
                      type="number"
                      min="0"
                      className="w-24 !text-center mx-auto block p-2"
                      placeholder={match.teamA?.name}
                      value={scoreForm[match._id]?.scoreA ?? match.scoreA}
                      onChange={(event) =>
                        handleScoreChange(match._id, "scoreA", event.target.value)
                      }
                    />
                  </td>
                  <td className="!text-center align-middle">
                    <input
                      type="number"
                      min="0"
                      className="w-24 !text-center mx-auto block p-2"
                      placeholder={match.teamB?.name}
                      value={scoreForm[match._id]?.scoreB ?? match.scoreB}
                      onChange={(event) =>
                        handleScoreChange(match._id, "scoreB", event.target.value)
                      }
                    />
                  </td>
                  <td className="!text-center align-middle">
                    <button
                      className="button small w-full max-w-[100px] mx-auto block"
                      onClick={() => handleScoreSubmit(match._id)}
                      type="button"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card card-elevated h-full flex flex-col">
        <PageHeader
          title="Team Standings Override"
          subtitle="Manually adjust calculated standings for penalty deductions or special corrections."
        />
        <div className="table-wrapper">
          <table>
            <thead>
               <tr>
                 <th>Team</th>
                 <th className="!text-center">P</th>
                 <th className="!text-center">W</th>
                 <th className="!text-center">D</th>
                 <th className="!text-center">L</th>
                 <th className="!text-center">Pts</th>
                 <th className="!text-center">Action</th>
               </tr>
            </thead>
            <tbody>
              {standings.map((std) => (
                <tr key={std._id}>
                  <td>{std.team?.name}</td>
                  <td className="!text-center align-middle">
                    <input type="number" min="0" value={standingsForm[std._id]?.played ?? std.played} onChange={(e) => handleStandingsChange(std._id, 'played', e.target.value)} className="w-[70px] !text-center mx-auto block p-2" />
                  </td>
                  <td className="!text-center align-middle">
                    <input type="number" min="0" value={standingsForm[std._id]?.won ?? std.won} onChange={(e)=> handleStandingsChange(std._id, 'won', e.target.value)} className="w-[70px] !text-center mx-auto block p-2" />
                  </td>
                  <td className="!text-center align-middle">
                    <input type="number" min="0" value={standingsForm[std._id]?.draw ?? std.draw} onChange={(e)=> handleStandingsChange(std._id, 'draw', e.target.value)} className="w-[70px] !text-center mx-auto block p-2" />
                  </td>
                  <td className="!text-center align-middle">
                    <input type="number" min="0" value={standingsForm[std._id]?.lost ?? std.lost} onChange={(e)=> handleStandingsChange(std._id, 'lost', e.target.value)} className="w-[70px] !text-center mx-auto block p-2" />
                  </td>
                  <td className="!text-center align-middle">
                    <input type="number" value={standingsForm[std._id]?.points ?? std.points} onChange={(e)=> handleStandingsChange(std._id, 'points', e.target.value)} className="w-[70px] !text-center mx-auto block p-2" />
                  </td>
                  <td className="!text-center align-middle">
                    <button className="button small mx-auto block" onClick={() => handleStandingsSubmit(std._id)}>Save</button>
                  </td>
                </tr>
              ))}
              {standings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-slate-500">No standings generated yet. Run matches or wait for calculation.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AnalyticsPanel tournaments={tournaments} matches={matches} />
      
      </div>
    </section>
  );
};

export default AdminDashboard;
