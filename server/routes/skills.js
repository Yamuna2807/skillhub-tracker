const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();

// List all skills
router.get('/', async (_, res) => {
  const all = await Skill.find();
  res.json(all);
});

// Create new skill (with lessons validation)
router.post('/', async (req, res) => {
  try {
    const { name, lessons } = req.body;
    if (!name || !Array.isArray(lessons) || lessons.length === 0) {
      return res.status(400).json({ error: "Skill name and at least one lesson are required." });
    }
    const skill = new Skill({ ...req.body });
    await skill.save();
    res.json(skill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark lesson as completed and update streak
router.patch('/:id/complete', async (req, res) => {
  try {
    const { lesson } = req.body;
    if (!lesson) return res.status(400).json({ error: "Lesson name missing" });
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    if (!skill.lessons.includes(lesson)) {
        return res.status(400).json({ error: "Lesson is not defined for this skill." });
    }
    
    if (!skill.completedLessons.includes(lesson)) {
      skill.completedLessons.push(lesson);
      skill.lastCompletedDates.push(new Date());
      await skill.save();
    }
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a skill
router.delete('/:id', async (req, res) => {
  try {
    const result = await Skill.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;