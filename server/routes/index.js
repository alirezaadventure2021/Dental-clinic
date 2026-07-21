const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const serviceRoutes = require("./services");
const treatmentRoutes = require("./treatments");

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/treatments", treatmentRoutes);

module.exports = router;
