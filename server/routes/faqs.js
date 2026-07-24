const express = require("express");
const { Faq } = require("../models");

const router = express.Router();

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      order: [["sort_order", "ASC"], ["created_at", "DESC"]],
    });
    res.json({ faqs });
  } catch (error) {
    console.error("Get FAQs error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Get single FAQ
router.get("/:id", async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "سوال یافت نشد" });
    }
    res.json({ faq });
  } catch (error) {
    console.error("Get FAQ error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Create FAQ
router.post("/", async (req, res) => {
  try {
    const { question, answer, sort_order, status } = req.body;

    if (!question) {
      return res.status(400).json({ message: "سوال الزامی است" });
    }

    if (!answer) {
      return res.status(400).json({ message: "پاسخ الزامی است" });
    }

    const faq = await Faq.create({
      question,
      answer,
      sort_order: sort_order || 0,
      status: status || "active",
    });

    res.status(201).json({ message: "سوال با موفقیت ایجاد شد", faq });
  } catch (error) {
    console.error("Create FAQ error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Update FAQ
router.put("/:id", async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "سوال یافت نشد" });
    }

    const { question, answer, sort_order, status } = req.body;

    if (question !== undefined && !question) {
      return res.status(400).json({ message: "سوال الزامی است" });
    }

    if (answer !== undefined && !answer) {
      return res.status(400).json({ message: "پاسخ الزامی است" });
    }

    await faq.update({
      question: question !== undefined ? question : faq.question,
      answer: answer !== undefined ? answer : faq.answer,
      sort_order: sort_order !== undefined ? sort_order : faq.sort_order,
      status: status || faq.status,
    });

    res.json({ message: "سوال با موفقیت بروزرسانی شد", faq });
  } catch (error) {
    console.error("Update FAQ error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Delete FAQ
router.delete("/:id", async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "سوال یافت نشد" });
    }

    await faq.destroy();
    res.json({ message: "سوال با موفقیت حذف شد" });
  } catch (error) {
    console.error("Delete FAQ error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

module.exports = router;
