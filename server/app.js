const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("./routes");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);

const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully.");

    await db.sequelize.sync({ alter: true });
    console.log("Models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

start();

module.exports = app;
