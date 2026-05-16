const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const frontendBuildPath = path.join(__dirname, "../../frontend/dist");


// Middlewares
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));


// Health route
app.get("/api/health", (req, res) => {
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

if (process.env.SERVE_FRONTEND !== "false") {
  app.use(express.static(frontendBuildPath));

  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}


module.exports = app;