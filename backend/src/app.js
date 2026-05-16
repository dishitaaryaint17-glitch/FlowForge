const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API Running Successfully",
  });
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);


module.exports = app;