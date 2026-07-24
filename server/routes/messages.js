const express = require("express");
const { Message } = require("../models");

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["created_at", "DESC"]],
    });
    res.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Get single message
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    // Mark as read
    if (!message.is_read) {
      await message.update({ is_read: true });
    }

    res.json({ message });
  } catch (error) {
    console.error("Get message error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Create message (from website contact form)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name) {
      return res.status(400).json({ message: "نام الزامی است" });
    }

    if (!email) {
      return res.status(400).json({ message: "ایمیل الزامی است" });
    }

    if (!message) {
      return res.status(400).json({ message: "پیام الزامی است" });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    });

    res.status(201).json({ message: "پیام با موفقیت ارسال شد", id: newMessage.id });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Delete message
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    await message.destroy();
    res.json({ message: "پیام با موفقیت حذف شد" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

// Mark message as read/unread
router.patch("/:id/read", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    const { is_read } = req.body;
    await message.update({ is_read: is_read !== undefined ? is_read : true });

    res.json({ message: "وضعیت پیام بروزرسانی شد", message });
  } catch (error) {
    console.error("Update message read status error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
});

module.exports = router;
