import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkillList from './components/SkillList';
import AddSkill from './components/AddSkill';
import './App.css';

function App() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add loading and error state for initial fetch
    axios.get('https://skillhub-tracker-api.onrender.com')
      .then(res => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch(e => {
        setError("Failed to load skills. Check server connection.");
        setLoading(false);
        console.error("Fetch Error:", e);
      });
  }, []);

  if (loading) {
    return (
      <div className="app loading-state">
        <h1 className="app-title">🎓 SkillHub Tracker</h1>
        <p className="loading-text">Loading your skills...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="app-title">🎓 SkillHub Tracker</h1>
      {error && <p className="app-error-message">Error: {error}</p>}
      <AddSkill setSkills={setSkills} />
      <SkillList skills={skills} setSkills={setSkills} />
    </div>
  );
}
export default App;