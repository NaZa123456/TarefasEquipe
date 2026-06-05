import React, { useState } from "react";

export default function TeamForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <h3>{initial ? "Edit Team" : "New Team"}</h3>
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{initial ? "Update" : "Create"}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
