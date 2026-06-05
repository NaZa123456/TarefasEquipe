import React, { useState, useEffect } from "react";
import { taskAPI, teamAPI } from "../services/api";
import Loading from "../components/Loading";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    loadData();
  }, [page, statusFilter, search]);

  const loadData = async () => {
    try {
      const params = { page, limit: 5 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const [tasksRes, statsRes, teamsRes] = await Promise.all([
        taskAPI.getAll(params),
        taskAPI.getStats(),
        teamAPI.getAll(),
      ]);
      setTaskData(tasksRes.data);
      setStats(statsRes.data);
      setTeams(teamsRes.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card stat-done">
            <span className="stat-number">{stats.done}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card stat-todo">
            <span className="stat-number">{stats.todo}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card stat-teams">
            <span className="stat-number">{teams.length}</span>
            <span className="stat-label">Active Teams</span>
          </div>
        </div>
      )}

      <div className="dashboard-filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Task Distribution</h3>
          <div className="bar-chart">
            <div className="bar bar-todo" style={{ width: `${stats ? (stats.todo / stats.total) * 100 : 0}%` }}>
              Todo ({stats?.todo || 0})
            </div>
            <div className="bar bar-progress" style={{ width: `${stats ? (stats.inProgress / stats.total) * 100 : 0}%` }}>
              In Progress ({stats?.inProgress || 0})
            </div>
            <div className="bar bar-done" style={{ width: `${stats ? (stats.done / stats.total) * 100 : 0}%` }}>
              Done ({stats?.done || 0})
            </div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Tasks</h2>
        {taskData?.tasks?.length === 0 ? (
          <p className="empty-state">No tasks yet. Create one in a team.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {taskData?.tasks?.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td><span className={`badge badge-${task.status}`}>{task.status.replace("_", " ")}</span></td>
                  <td><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
                  <td>{task.assignedUser?.name || "Unassigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {taskData && taskData.totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: taskData.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`btn btn-sm ${p === page ? "btn-primary" : "btn-outline"}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
