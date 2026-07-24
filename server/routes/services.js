const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { Service, Treatment } = require("../models");
const { uploadAndCompress } = require("../middleware/upload");

const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [{ model: Treatment, as: "treatments" }],
      order: [["created_at", "DESC"]],
    });
    res.json({ services });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Get single service
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{ model: Treatment, as: "treatments" }],
    });
    if (!service) {
      return res.status(404).json({ message: "خدمت یافت نشد" });
    }
    res.json({ service });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Create service with image upload
router.post("/", uploadAndCompress("image"), async (req, res) => {
  try {
    const { service_name, tags, status, description, treatmentIds } = req.body;

    if (!service_name) {
      return res.status(400).json({ message: "نام خدمت الزامی است" });
    }

    if (!description) {
      return res.status(400).json({ message: "توضیحات خدمت الزامی است" });
    }

    const image = req.file ? `/uploads/services/${req.file.filename}` : null;

    let parsedTreatmentIds = [];
    if (treatmentIds) {
      try {
        parsedTreatmentIds = JSON.parse(treatmentIds);
      } catch {
        return res.status(400).json({ message: "Invalid treatment IDs" });
      }

      if (
        !Array.isArray(parsedTreatmentIds) ||
        new Set(parsedTreatmentIds).size !== parsedTreatmentIds.length
      ) {
        return res.status(400).json({ message: "Invalid selected treatments" });
      }

      const treatments = await Treatment.findAll({
        where: { id: parsedTreatmentIds },
      });
      if (treatments.length !== parsedTreatmentIds.length) {
        return res
          .status(400)
          .json({ message: "One or more treatments were not found" });
      }
    }

    const service = await Service.create({
      service_name,
      image,
      tags: tags ? JSON.parse(tags) : [],
      status: status || "active",
      description,
    });

    if (parsedTreatmentIds.length > 0) {
      await service.setTreatments(parsedTreatmentIds);
    }

    res.status(201).json({ message: "خدمت با موفقیت ایجاد شد", service });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Update service with image upload
router.put("/:id", uploadAndCompress("image"), async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "خدمت یافت نشد" });
    }

    const {
      service_name,
      tags,
      status,
      description,
      removeImage,
      treatmentIds,
    } = req.body;

    if (description !== undefined && !description) {
      return res.status(400).json({ message: "توضیحات خدمت الزامی است" });
    }

    let image = service.image;

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (service.image) {
        const oldImagePath = path.join(__dirname, "..", service.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/services/${req.file.filename}`;
    }

    // Handle image removal
    if (removeImage === "true" && service.image) {
      const oldImagePath = path.join(__dirname, "..", service.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      image = null;
    }

    // Handle treatment associations update
    if (treatmentIds) {
      let parsedTreatmentIds = [];
      try {
        parsedTreatmentIds = JSON.parse(treatmentIds);
      } catch {
        return res.status(400).json({ message: "Invalid treatment IDs" });
      }

      if (
        !Array.isArray(parsedTreatmentIds) ||
        new Set(parsedTreatmentIds).size !== parsedTreatmentIds.length
      ) {
        return res.status(400).json({ message: "Invalid selected treatments" });
      }

      const treatments = await Treatment.findAll({
        where: { id: parsedTreatmentIds },
      });
      if (treatments.length !== parsedTreatmentIds.length) {
        return res
          .status(400)
          .json({ message: "One or more treatments were not found" });
      }

      await service.setTreatments(parsedTreatmentIds);
    }

    await service.update({
      service_name: service_name || service.service_name,
      image,
      tags: tags ? JSON.parse(tags) : service.tags,
      status: status || service.status,
      description:
        description !== undefined ? description : service.description,
    });

    res.json({ message: "خدمت با موفقیت بروزرسانی شد", service });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Delete service
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "خدمت یافت نشد" });
    }

    // Delete associated image
    if (service.image) {
      const imagePath = path.join(__dirname, "..", service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await service.destroy();
    res.json({ message: "خدمت با موفقیت حذف شد" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "حجم فایل نباید بیشتر از 5 مگابایت باشد" });
    }
    return res.status(400).json({ message: "خطا در آپلود فایل" });
  }
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
