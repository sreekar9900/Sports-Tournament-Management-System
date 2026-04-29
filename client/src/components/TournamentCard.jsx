import { Link } from "react-router-dom";

const TournamentCard = ({ tournament }) => (
  <article className="card card-elevated tournament-card">
    <div className="badge-row">
      <span className="badge">{tournament.sportType}</span>
      <span className="badge secondary">{tournament.format}</span>
    </div>
    <h3>{tournament.name}</h3>
    <p>
      {new Date(tournament.startDate).toLocaleDateString()} to{" "}
      {new Date(tournament.endDate).toLocaleDateString()}
    </p>
    <p className="muted">{tournament.rules || "Rules will be shared by the organizer."}</p>
    <Link className="button secondary" to={`/tournaments/${tournament._id}`}>
      View details
    </Link>
  </article>
);

export default TournamentCard;
