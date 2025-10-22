const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lessons: [{ type: String }],
  completedLessons: [{ type: String }],
  lastCompletedDates: [{ type: Date }]
});

module.exports = mongoose.model('Skill', SkillSchema);
