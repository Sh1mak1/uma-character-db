import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '', suitabilityName: '', suitabilityValue: 1, uniqueName: '', uniqueValue: 1, factorName: '', factorValue: 1
  });
  const [skillInput, setSkillInput] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => { loadAllSkills(); loadCharacters(); }, []);

  const loadAllSkills = async () => { try { const r = await axios.get(`${API_BASE_URL}/skills`); setAllSkills(r.data.data); } catch (e) { console.error(e); } };
  const loadCharacters = async () => { try { const r = await axios.get(`${API_BASE_URL}/characters`); setCharacters(r.data.data); } catch (e) { console.error(e); } };

  const addNewSkill = async () => {
    if (!newSkillInput.trim()) return;
    try {
      const r = await axios.post(`${API_BASE_URL}/skills`, { name: newSkillInput });
      setAllSkills([...allSkills, r.data.data]);
      setNewSkillInput('');
      showMessage('スキルを追加しました');
    } catch (e) { showMessage('エラー：既に存在する可能性があります', 'error'); }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(`${API_BASE_URL}/characters`, {
        name: formData.name,
        attributes: [
          { name: formData.suitabilityName, value: formData.suitabilityValue },
          { name: formData.uniqueName, value: formData.uniqueValue },
          { name: formData.factorName, value: formData.factorValue }
        ],
        skills: selectedSkills.map(s => s.id)
      });
      setCharacters([...characters, r.data.data]);
      setFormData({ name: '', suitabilityName: '', suitabilityValue: 1, uniqueName: '', uniqueValue: 1, factorName: '', factorValue: 1 });
      setSelectedSkills([]);
      showMessage('保存しました！');
    } catch (e) { showMessage('保存エラー', 'error'); }
  };

  const showMessage = (text, type = 'success') => { setMessage({ text, type }); setTimeout(() => setMessage(''), 3000); };

  return (
    <div className="container">
      <h1>🎮 Game Character Database</h1>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <div className="main-grid">
        <div className="card">
          <h2>キャラクター作成</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>名前</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>属性（適正・固有・因子）</label>
              <div className="attributes-grid">
                <input type="text" placeholder="名前" onChange={e => setFormData({...formData, suitabilityName: e.target.value})} required />
                <input type="number" min="1" max="3" value={formData.suitabilityValue} onChange={e => setFormData({...formData, suitabilityValue: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">保存</button>
          </form>
        </div>
        
        <div className="card">
          <h2>スキル管理</h2>
          <input type="text" value={newSkillInput} onChange={e => setNewSkillInput(e.target.value)} />
          <button className="btn btn-primary" onClick={addNewSkill}>スキル追加</button>
          <div className="skills-container">
            {allSkills.map(s => <div key={s.id} className="skill-item">{s.name}</div>)}
          </div>
        </div>

        <div className="card characters-section">
          <h2>一覧</h2>
          <div className="characters-grid">
            {characters.map(c => (
              <div key={c.id} className="character-card">
                <h3>{c.name}</h3>
                {c.attributes.map(a => <div key={a.id}>{a.name}: {a.value}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
