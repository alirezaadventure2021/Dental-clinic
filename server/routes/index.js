const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const serviceRoutes = require("./services");
const treatmentRoutes = require("./treatments");
const faqRoutes = require("./faqs");
const galleryRoutes = require("./gallery");
const messageRoutes = require("./messages");

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/treatments", treatmentRoutes);
router.use("/faqs", faqRoutes);
router.use("/gallery", galleryRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
