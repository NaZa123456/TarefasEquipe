import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userAPI } from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.updateProfile({ name, email });
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {message && <div className="alert alert-success">{message}</div>}
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Member since</label>
          <p className="text-muted">{new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
}
