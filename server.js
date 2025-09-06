require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ---------- middleware ----------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true })); 
app.use(express.text({ type: "text/*", limit: "1mb" })); 
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "*" : ["http://localhost:3000"],
    credentials: true,
  })
);

// ---------- routes ----------
let promptsData;
try {
  promptsData = require("./routes/api/promptsData");
} catch (err) {
  console.error("Failed to load routes/api/promptsData:", err);
  promptsData = express.Router();
}

// primary mount
app.use("/api/prompts", promptsData);
// alias so UIs that call /api/enhance also work
app.use("/api/enhance", promptsData);

// health
app.get("/ping", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ---------- serve React build in production ----------
if (process.env.NODE_ENV === "production") {
  // CRA builds to "client/build"
  const clientBuild = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuild));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

// ---------- start ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
);
