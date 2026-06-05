import React, { useState } from "react";

export default function TaskForm({ initial, onSubmit, onCancel, members }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState(initial?.status || "todo");
  const [priority, setPriority] = useState(initial?.priority || "medium");
  const [assignedUserId, setAssignedUserId] = useState(initial?.assignedUserId || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      priority,
      assignedUserId: assignedUserId ? Number(assignedUserId) : null,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>{initial ? "Edit Task" : "New Task"}</h3>
      <div className="form-group">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Assign to</label>
        <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)}>
          <option value="">Unassigned</option>
          {members?.map((m) => (
            <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{initial ? "Update" : "Create"}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
