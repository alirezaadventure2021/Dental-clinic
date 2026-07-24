const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("./routes");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Trust proxy (required for rate limiting behind nginx)
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
    : "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api", routes);

// Production: serve built frontend files
if (NODE_ENV === "production") {
  const websiteDist = path.join(__dirname, "..", "website", "dist");
  const cmsDist = path.join(__dirname, "..", "cms", "dist");

  // CMS static files (must be before website catch-all)
  app.use("/cms", express.static(cmsDist));

  // Website static files (catch-all for root)
  app.use(express.static(websiteDist));

  // CMS SPA fallback - serve index.html for any /cms route not matched
  app.get("/cms/*", (req, res) => {
    res.sendFile(path.join(cmsDist, "index.html"));
  });

  // Website SPA fallback - serve index.html for any root route not matched
  app.get("*", (req, res) => {
    // Don't serve website index for API or uploads
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return res.status(404).json({ message: "Not found" });
    }
    res.sendFile(path.join(websiteDist, "index.html"));
  });
}

const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully.");

    await db.sequelize.sync({ alter: true });
    console.log("Models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${NODE_ENV}]`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

start();

module.exports = app;
