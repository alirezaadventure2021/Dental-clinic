const express = require("express");
const path = require("path");
const fs = require("fs");
const { GalleryImage, Service } = require("../models");
const { uploadAndCompress } = require("../middleware/upload");

const router = express.Router();

// Get all gallery images
router.get("/", async (req, res) => {
  try {
    const images = await GalleryImage.findAll({
      include: [
        { model: Service, as: "service", attributes: ["id", "service_name"] },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json({ images });
  } catch (error) {
    console.error("Get gallery images error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Get single gallery image
router.get("/:id", async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id, {
      include: [
        { model: Service, as: "service", attributes: ["id", "service_name"] },
      ],
    });
    if (!image) {
      return res.status(404).json({ message: "تصویر یافت نشد" });
    }
    res.json({ image });
  } catch (error) {
    console.error("Get gallery image error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Create gallery image with upload
router.post("/", uploadAndCompress("image", "gallery"), async (req, res) => {
  try {
    const { description, service_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "تصویر الزامی است" });
    }

    if (!service_id) {
      return res.status(400).json({ message: "انتخاب خدمت الزامی است" });
    }

    const image = `/uploads/gallery/${req.file.filename}`;

    const galleryImage = await GalleryImage.create({
      image,
      description: description || "",
      service_id,
    });

    res
      .status(201)
      .json({ message: "تصویر با موفقیت اضافه شد", image: galleryImage });
  } catch (error) {
    console.error("Create gallery image error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Update gallery image
router.put("/:id", uploadAndCompress("image", "gallery"), async (req, res) => {
  try {
    const galleryImage = await GalleryImage.findByPk(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ message: "تصویر یافت نشد" });
    }

    const { description, service_id, removeImage } = req.body;

    let image = galleryImage.image;

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (galleryImage.image) {
        const oldImagePath = path.join(__dirname, "..", galleryImage.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/gallery/${req.file.filename}`;
    }

    // Handle image removal
    if (removeImage === "true" && galleryImage.image) {
      const oldImagePath = path.join(__dirname, "..", galleryImage.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      image = null;
    }

    await galleryImage.update({
      image,
      description:
        description !== undefined ? description : galleryImage.description,
      service_id:
        service_id !== undefined ? service_id : galleryImage.service_id,
    });

    res.json({ message: "تصویر با موفقیت بروزرسانی شد", image: galleryImage });
  } catch (error) {
    console.error("Update gallery image error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Delete gallery image
router.delete("/:id", async (req, res) => {
  try {
    const galleryImage = await GalleryImage.findByPk(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ message: "تصویر یافت نشد" });
    }

    // Delete associated image file
    if (galleryImage.image) {
      const imagePath = path.join(__dirname, "..", galleryImage.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await galleryImage.destroy();
    res.json({ message: "تصویر با موفقیت حذف شد" });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

module.exports = router;
