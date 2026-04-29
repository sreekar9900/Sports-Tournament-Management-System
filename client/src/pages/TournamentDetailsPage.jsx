import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import getErrorMessage from "../utils/getErrorMessage";
import { useNotification } from "../context/NotificationContext";

const TournamentDetailsPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [error, setError] = useState("");
  const [aiPrediction, setAiPrediction] = useState(null);
  const { socket } = useNotification();

  useEffect(() => {
    const loadTournament = async () => {
      try {
        const [tournamentResponse, teamsResponse, matchesResponse, standingsResponse] =
          await Promise.all([
            api.get(`/tournaments/${id}`),
            api.get(`/tournaments/${id}/teams`),
            api.get(`/tournaments/${id}/matches`),
            api.get(`/tournaments/${id}/standings`)
          ]);

        setTournament(tournamentResponse.data);
        setTeams(teamsResponse.data);
        setMatches(matchesResponse.data);
        setStandings(standingsResponse.data);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };

    loadTournament();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    
    // Live match update hook
    const handleMatchUpdate = async (data) => {
      if (data.tournamentId === id) {
        // Optimistically update matches
        setMatches(prev => prev.map(m => m._id === data.match._id ? data.match : m));
        // Soft refresh standings
        const standingsResponse = await api.get(`/tournaments/${id}/standings`);
        setStandings(standingsResponse.data);
      }
    };

    socket.on("match_updated", handleMatchUpdate);
    return () => {
      socket.off("match_updated", handleMatchUpdate);
    };
  }, [socket, id]);

  const fetchPrediction = async (matchId) => {
    try {
      const response = await api.get(`/matches/${matchId}/predict`);
      setAiPrediction(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!tournament) {
    return <div className="page-shell">{error || "Loading tournament details..."}</div>;
  }

  return (
    <section className="detail-stack">
      <PageHeader
        title={tournament.name}
        subtitle={`${tournament.sportType} | ${tournament.format} | ${new Date(
          tournament.startDate
        ).toLocaleDateString()} - ${new Date(tournament.endDate).toLocaleDateString()}`}
      />
      <div className="detail-grid">
        <div className="card">
          <h3>Rules</h3>
          <p>{tournament.rules || "Standard tournament rules apply."}</p>
        </div>
        <div className="card">
          <h3>Registered Teams</h3>
          <ul className="list">
            {teams.map((entry) => (
              <li key={entry._id}>{entry.team?.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <h3>Matches</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Fixture</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id}>
                  <td>{match.round}</td>
                  <td>
                    {match.teamA?.name} vs {match.teamB?.name}
                  </td>
                  <td>{match.status}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span>{match.scoreA} - {match.scoreB}</span>
                      {match.status !== "completed" && (
                         <button 
                           onClick={() => fetchPrediction(match._id)}
                           className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded transition w-max"
                         >
                           AI Predict
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {aiPrediction && (
             <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl relative">
                <button onClick={() => setAiPrediction(null)} className="absolute top-2 right-3 text-indigo-400 hover:text-indigo-600">&times;</button>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                   <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wider">AI Match Simulation</h4>
                </div>
                <p className="text-slate-700 mb-3 text-sm">{aiPrediction.insight}</p>
                <div className="flex gap-4">
                   <div className="flex-1 bg-white p-3 rounded shadow-sm border border-slate-100 text-center">
                     <div className="font-semibold text-slate-800 truncate mb-1">{aiPrediction.prediction.teamA.name}</div>
                     <div className="text-2xl font-black text-emerald-600">{aiPrediction.prediction.teamA.winProbability}%</div>
                   </div>
                   <div className="flex-1 bg-white p-3 rounded shadow-sm border border-slate-100 text-center">
                     <div className="font-semibold text-slate-800 truncate mb-1">{aiPrediction.prediction.teamB.name}</div>
                     <div className="text-2xl font-black text-emerald-600">{aiPrediction.prediction.teamB.winProbability}%</div>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
      <div className="card">
        <h3>Standings</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr key={row._id}>
                  <td>{row.team?.name}</td>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.draw}</td>
                  <td>{row.lost}</td>
                  <td>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TournamentDetailsPage;
