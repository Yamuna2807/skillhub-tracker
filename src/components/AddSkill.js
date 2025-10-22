import React, { useState } from 'react';
import axios from 'axios';
import './AddSkill.css';

function AddSkill({ setSkills }) {
  const [name, setName] = useState('');
  const [lessons, setLessons] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = async () => {
    setError('');
    
    const lessonArr = lessons.split(',').map(x => x.trim()).filter(Boolean);
    
    if (!name.trim()) {
      setError("Skill name is required.");
      return;
    }
    if (lessonArr.length === 0) {
      setError("Please enter at least one lesson, separated by commas.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('https://skillhub-tracker-api.onrender.com', { 
        name, 
        lessons: lessonArr, 
        completedLessons: [], 
        lastCompletedDates: [] 
      });
      setSkills(prev => [...prev, res.data]);
      setName('');
      setLessons('');
    } catch (e) {
      setError("Failed to add skill: " + (e.response?.data?.error || "Server error."));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-skill-wrapper">
      <div className="add-skill">
        <input
          placeholder="Skill name (e.g. ReactJS)"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isLoading}
          className="add-skill-input" // Added class for easier targeting
        />
        <input
          placeholder="Lessons (comma separated)"
          value={lessons}
          onChange={e => setLessons(e.target.value)}
          disabled={isLoading}
          className="add-skill-input" // Added class for easier targeting
        />
        <button onClick={addSkill} disabled={isLoading} className="add-skill-button">
          {isLoading ? 'Adding...' : 'Add Skill'}
        </button>
      </div>
      {error && <p className="add-skill-error">⚠️ {error}</p>}
    </div>
  );
}

export default AddSkill;