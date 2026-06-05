import React from "react";

export default function TaskCard({ task, onEdit, onDelete }) {
  const statusLabels = { todo: "Todo", in_progress: "In Progress", done: "Done" };
  const priorityLabels = { low: "Low", medium: "Medium", high: "High" };
  const statusClass = `badge badge-${task.status}`;
  const priorityClass = `badge badge-${task.priority}`;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <div className="task-card-actions">
          <button className="btn btn-sm btn-outline" onClick={() => onEdit(task)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-meta">
        <span className={statusClass}>{statusLabels[task.status]}</span>
        <span className={priorityClass}>{priorityLabels[task.priority]}</span>
        {task.assignedUser && <span className="task-assignee">Assigned to: {task.assignedUser.name}</span>}
      </div>
    </div>
  );
}
