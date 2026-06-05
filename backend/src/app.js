require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const teamRoutes = require("./routes/team.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorMiddleware);

module.exports = app;
