import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api, { teamAPI, taskAPI } from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Loading from "../components/Loading";

export default function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState({ tasks: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [addMemberEmail, setAddMemberEmail] = useState("");

  const loadTeam = useCallback(async () => {
    try {
      const [teamRes, tasksRes] = await Promise.all([
        teamAPI.getAll(),
        taskAPI.getAll({ teamId: id, status: statusFilter || undefined, page, limit: 6 }),
      ]);
      const found = teamRes.data.find((t) => t.id === Number(id));
      setTeam(found);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Failed to load team", err);
    } finally {
      setLoading(false);
    }
  }, [id, statusFilter, page]);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  const handleCreateTask = async (data) => {
    try {
      await taskAPI.create({ ...data, teamId: Number(id) });
      setShowTaskForm(false);
      loadTeam();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create task");
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      await taskAPI.update(editingTask.id, data);
      setEditingTask(null);
      loadTeam();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await taskAPI.remove(taskId);
      loadTeam();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const allUsersRes = await api.get("/users");
      const user = allUsersRes.data.find((u) => u.email === addMemberEmail);
      if (!user) { alert("User not found. They must register first."); return; }
      await teamAPI.addMember(Number(id), user.id);
      setAddMemberEmail("");
      loadTeam();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Remove this member?")) return;
    try {
      await teamAPI.removeMember(Number(id), userId);
      loadTeam();
    } catch (err) {
      alert("Failed to remove member");
    }
  };

  if (loading) return <Loading />;
  if (!team) return <p className="empty-state">Team not found</p>;

  return (
    <div className="team-detail">
      <div className="page-header">
        <div>
          <h1>{team.name}</h1>
          {team.description && <p className="text-muted">{team.description}</p>}
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowTaskForm(!showTaskForm); }}>
          {showTaskForm ? "Cancel" : "New Task"}
        </button>
      </div>

      <div className="team-members-section">
        <h2>Members ({team.members?.length || 0})</h2>
        <div className="members-list">
          {team.members?.map((m) => (
            <div key={m.user.id} className="member-chip">
              <span>{m.user.name}</span>
              <button className="btn-icon" onClick={() => handleRemoveMember(m.user.id)} title="Remove">&times;</button>
            </div>
          ))}
        </div>
        <form className="add-member-form" onSubmit={handleAddMember}>
          <input type="email" placeholder="Add member by email..." value={addMemberEmail} onChange={(e) => setAddMemberEmail(e.target.value)} required />
          <button type="submit" className="btn btn-sm btn-primary">Add</button>
        </form>
      </div>

      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
          members={team.members}
        />
      )}

      {editingTask && (
        <TaskForm
          initial={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          members={team.members}
        />
      )}

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Tasks ({tasks.total})</h2>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {tasks.tasks?.length === 0 ? (
          <p className="empty-state">No tasks in this team.</p>
        ) : (
          <div className="tasks-grid">
            {tasks.tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={setEditingTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        )}

        {tasks.totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: tasks.totalPages }, (_, i) => i + 1).map((p) => (
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
