import React, { useState } from 'react';
import axios from 'axios';
import './SkillList.css';

// Motivational quotes with emojis!
const quotes = [
  "💪 Great job! Progress is progress.",
  "🔥 Keep the streak alive!",
  "🚀 Consistent effort leads to big results.",
  "🏃 Every step counts!",
  "✨ Push yourself—you're getting better every day!",
  "🎯 Focus on your goals and smash them!",
  "🌟 Excellence is a habit—keep it up!",
  "🥇 One more step towards mastery!",
  "👍 You're on fire, keep going!",
];

function getStreak(skill) {
  if (!skill.lastCompletedDates || skill.lastCompletedDates.length === 0) return 0;
  
  const uniqueDates = Array.from(new Set(
    skill.lastCompletedDates
      .map(dt => new Date(dt).setHours(0, 0, 0, 0))
  )).sort((a, b) => b - a);

  let streak = 0;
  let today = new Date().setHours(0, 0, 0, 0);
  let yesterday = today - 24 * 60 * 60 * 1000;
  let checkDate = today;

  if (uniqueDates[0] === today) {
      streak = 1;
      checkDate = yesterday;
  } else if (uniqueDates[0] === yesterday) {
      streak = 1;
      checkDate = yesterday - 24 * 60 * 60 * 1000;
  } else {
      return 0;
  }
  
  for (let i = 1; i < uniqueDates.length; i++) {
    if (uniqueDates[i] === checkDate) {
      streak++;
      checkDate -= 24 * 60 * 60 * 1000;
    } else if (uniqueDates[i] < checkDate) {
      break;
    }
  }
  return streak;
}


function getBadgeForStreak(streak) {
  if (streak >= 10) {
    return (
      <span role="img" aria-label="Trophy" style={{ fontSize: '1.7em', marginLeft: '8px' }}>
        🏆
      </span>
    );
  } else if (streak >= 5) {
    return (
      <span role="img" aria-label="Medal" style={{ fontSize: '1.4em', marginLeft: '8px' }}>
        🎖️
      </span>
    );
  } else {
    return null;
  }
}

function SkillList({ skills, setSkills }) {
  const [activeQuoteSkillId, setActiveQuoteSkillId] = useState(null);
  const [motivation, setMotivation] = useState('');

  const handleCheckbox = async (skillId, lesson, checked) => {
    if (checked) {
      try {
        const res = await axios.patch(
          `https://skillhub-tracker-api.onrender.com/${skillId}/complete`,
          { lesson }
        );
        setSkills(skills.map(s => (s._id === skillId ? res.data : s))); 
        
        setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
        setActiveQuoteSkillId(skillId);
        setTimeout(() => setActiveQuoteSkillId(null), 2500);
      } catch (e) {
        alert("Failed to update skill: " + (e.response?.data?.error || e.message));
      }
    }
  };
  
  const deleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill permanently?")) {
        return;
    }
    try {
        await axios.delete(`https://skillhub-tracker-api.onrender.com/${skillId}`);
        setSkills(prev => prev.filter(s => s._id !== skillId));
    } catch (e) {
        alert("Failed to delete skill.");
        console.error(e);
    }
  };


  return (
    <div className="skills-container">
      {skills.length === 0 && <p className="no-skills-message">No skills added yet. Start your learning journey!</p>}
      {skills.map(skill => {
        const total = skill.lessons.length;
        const done = skill.completedLessons.length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);
        const streak = getStreak(skill);
        const isCompleted = skill.completedLessons.includes(skill.lessons[skill.lessons.length - 1]);

        return (
          <div className={`skill-card ${isCompleted ? 'skill-completed' : ''}`} key={skill._id}>
            <div className="skill-card-header">
                <h3>{skill.name}</h3>
                <button className="delete-skill-btn" onClick={() => deleteSkill(skill._id)}>
                    Delete 
                </button>
            </div>
            
            <div className="progress">
              <div className="progress-bar" style={{ width: `${percent}%` }}></div>
            </div>
            <span className="progress-label">{percent}% completed</span>
            
            <div className="streak-bar">
              <span>
                🔥 {streak} day streak!
                {getBadgeForStreak(streak)}
              </span>
            </div>
            
            <ul>
              {skill.lessons.map((lesson, idx) => (
                <li key={idx}
                  className={skill.completedLessons.includes(lesson) ? 'lesson-completed-text' : ''}
                >
                  <label className="lesson-label">
                    <input
                      type="checkbox"
                      checked={skill.completedLessons.includes(lesson)}
                      onChange={e => handleCheckbox(skill._id, lesson, e.target.checked)}
                      disabled={skill.completedLessons.includes(lesson)}
                    />
                    <span className="lesson-text">{lesson}</span>
                  </label>
                </li>
              ))}
            </ul>
            
            {activeQuoteSkillId === skill._id && (
              <div className="motivation-quote">{motivation}</div>
            )}
            
          </div>
        );
      })}
    </div>
  );
}

export default SkillList;