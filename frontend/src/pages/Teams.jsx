import React, { useState, useEffect } from "react";
import { teamAPI } from "../services/api";
import TeamCard from "../components/TeamCard";
import TeamForm from "../components/TeamForm";
import Loading from "../components/Loading";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadTeams(); }, []);

  const loadTeams = async () => {
    try {
      const res = await teamAPI.getAll();
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to load teams", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await teamAPI.create(data);
      setShowForm(false);
      loadTeams();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create team");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this team?")) return;
    try {
      await teamAPI.remove(id);
      loadTeams();
    } catch (err) {
      alert("Failed to delete team");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="teams-page">
      <div className="page-header">
        <h1>Teams</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Team"}
        </button>
      </div>

      {showForm && <TeamForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {teams.length === 0 ? (
        <p className="empty-state">No teams yet. Create your first team!</p>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
