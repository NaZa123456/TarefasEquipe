import React from "react";
import { Link } from "react-router-dom";

export default function TeamCard({ team }) {
  return (
    <div className="team-card">
      <div className="team-card-body">
        <h3>{team.name}</h3>
        {team.description && <p>{team.description}</p>}
        <div className="team-card-stats">
          <span>{team._count?.tasks || 0} tasks</span>
          <span>{team.members?.length || 0} members</span>
        </div>
      </div>
      <div className="team-card-footer">
        <Link to={`/teams/${team.id}`} className="btn btn-primary btn-sm">View Team</Link>
      </div>
    </div>
  );
}
