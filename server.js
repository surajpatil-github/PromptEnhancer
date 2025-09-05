require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "*" // in production allow all (or restrict to your domain)
        : ["http://localhost:3000"],
    credentials: true,
  })
);

// Import routes
let promptsData;
try {
  promptsData = require("./routes/api/promptsData");
} catch (error) {
  console.error("Error loading promptsData route:", error);
  promptsData = express.Router();
}

// API Routes
app.use("/api/prompts", promptsData);

// Example health route
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Serve static files from client in production
if (process.env.NODE_ENV === "production") {
  // ⚠️ If using Create React App, change "dist" to "build"
  const clientBuild = path.join(__dirname, "client", "dist");
  app.use(express.static(clientBuild));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
);

const path = require("path");

if (process.env.NODE_ENV === "production") {
  // Change 'build' to 'dist' if client uses Vite
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}
