const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// CREATE TASK (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      deadline,
      priority,
      status: 'todo'
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL TASKS (Admin sees all, Member sees assigned)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = { assignedTo: req.user.id };
    }
    const tasks = await Task.find(query).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE STATUS (Both, but Member only for their own task)
router.patch('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Authorization check
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    task.status = req.body.status || task.status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TEAM MEMBERS (Admin needs this to assign tasks)
router.get('/members', protect, adminOnly, async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).select('name _id');
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;