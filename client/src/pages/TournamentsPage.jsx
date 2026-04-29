import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import TournamentCard from "../components/TournamentCard";
import getErrorMessage from "../utils/getErrorMessage";

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const response = await api.get("/tournaments");
        setTournaments(response.data);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };

    loadTournaments();
  }, []);

  return (
    <section>
      <PageHeader
        title="Tournaments"
        subtitle="Browse active competitions, review tournament details, and follow match progress."
      />
      {error ? <p className="error-text">{error}</p> : null}
      <div className="grid">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament._id} tournament={tournament} />
        ))}
      </div>
    </section>
  );
};

export default TournamentsPage;
