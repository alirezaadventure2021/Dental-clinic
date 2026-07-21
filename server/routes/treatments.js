const express = require('express');
const { Treatment } = require('../models');

const router = express.Router();

// Get all treatments
router.get('/', async (req, res) => {
  try {
    const treatments = await Treatment.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json({ treatments });
  } catch (error) {
    console.error('Get treatments error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Get single treatment
router.get('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) {
      return res.status(404).json({ message: 'درمان یافت نشد' });
    }
    res.json({ treatment });
  } catch (error) {
    console.error('Get treatment error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Create treatment
router.post('/', async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'نام درمان الزامی است' });
    }

    const treatment = await Treatment.create({
      name,
      status: status || 'active',
    });

    res.status(201).json({ message: 'درمان با موفقیت ایجاد شد', treatment });
  } catch (error) {
    console.error('Create treatment error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Update treatment
router.put('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) {
      return res.status(404).json({ message: 'درمان یافت نشد' });
    }

    const { name, status } = req.body;

    await treatment.update({
      name: name || treatment.name,
      status: status || treatment.status,
    });

    res.json({ message: 'درمان با موفقیت بروزرسانی شد', treatment });
  } catch (error) {
    console.error('Update treatment error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Delete treatment
router.delete('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) {
      return res.status(404).json({ message: 'درمان یافت نشد' });
    }

    await treatment.destroy();
    res.json({ message: 'درمان با موفقیت حذف شد' });
  } catch (error) {
    console.error('Delete treatment error:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

module.exports = router;
