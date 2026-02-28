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
    name: '',
    suitabilityName: '適正', suitabilityValue: 1,
    uniqueName: '固有', uniqueValue: 1,
    factorName: 'ステータス因子', factorValue: 1
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => { loadAllSkills(); loadCharacters(); }, []);

  const loadAllSkills = async () => { 
    try { const r = await axios.get(`${API_BASE_URL}/skills`); setAllSkills(r.data.data); } catch (e) { console.error(e); } 
  };
  const loadCharacters = async () => { 
    try { const r = await axios.get(`${API_BASE_URL}/characters`); setCharacters(r.data.data); } catch (e) { console.error(e); } 
  };

  const addNewSkill = async () => {
    if (!newSkillInput.trim()) return;
    try {
      const r = await axios.post(`${API_BASE_URL}/skills`, { name: newSkillInput });
      setAllSkills([...allSkills, r.data.data]);
      setNewSkillInput('');
      showMessage('スキルを追加しました');
    } catch (e) { showMessage('エラー：既に存在する可能性があります', 'error'); }
  };

  // テキスト手打ちによるスキル追加（元の仕様）
  const addSkillToCharacter = () => {
    if (!skillInput.trim()) {
      showMessage('スキル名を入力してください', 'error');
      return;
    }

    const existingSkill = allSkills.find(s => s.name === skillInput);
    
    if (existingSkill) {
      if (selectedSkills.find(s => s.id === existingSkill.id)) {
        showMessage('このスキルは既に選択されています', 'error');
        return;
      }
      setSelectedSkills([...selectedSkills, existingSkill]);
    } else {
      // 新規スキルを一時的に追加
      const newSkill = { id: Date.now(), name: skillInput };
      setSelectedSkills([...selectedSkills, newSkill]);
    }
    setSkillInput('');
  };

  // 選択したスキルを削除（元の仕様）
  const removeSelectedSkill = (id) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== id));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(`${API_BASE_URL}/characters`, {
        name: formData.name,
        attributes: [
          { name: formData.suitabilityName, value: parseInt(formData.suitabilityValue) },
          { name: formData.uniqueName, value: parseInt(formData.uniqueValue) },
          { name: formData.factorName, value: parseInt(formData.factorValue) }
        ],
        // string(手打ちの新規スキル)は除外し、既存のIDのみ送る
        skills: selectedSkills.map(s => s.id).filter(id => typeof id === 'number' && id < Date.now())
      });
      setCharacters([...characters, r.data.data]);
      setFormData({ 
        name: '', 
        suitabilityName: '適正', suitabilityValue: 1, 
        uniqueName: '固有', uniqueValue: 1, 
        factorName: 'ステータス因子', factorValue: 1 
      });
      setSelectedSkills([]);
      showMessage('キャラクターを保存しました！');
    } catch (e) { 
      console.error(e.response);
      // エラーの本当の理由を画面に表示する
      const errorDetail = e.response?.data?.message || e.response?.data?.error || '不明なエラー';
      showMessage(`保存エラー: ${errorDetail}`, 'error'); 
    }
  };

  const showMessage = (text, type = 'success') => { setMessage({ text, type }); setTimeout(() => setMessage(''), 3000); };

  return (
    <div className="container">
      <h1>殿堂入りウマ娘管理</h1>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      
      <div className="main-grid">
        <div className="card">
          <h2>ウマ娘登録</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>キャラクター名</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>

            <div className="form-group">
              <div className="attributes-grid">
                <div className="attribute-input">
                  <input type="text" value={formData.suitabilityName} readOnly style={{backgroundColor: '#f0f0f0'}} />
                  <input type="number" min="1" max="3" value={formData.suitabilityValue} onChange={e => setFormData({...formData, suitabilityValue: e.target.value})} required />
                </div>
                <div className="attribute-input">
                  <input type="text" value={formData.uniqueName} readOnly style={{backgroundColor: '#f0f0f0'}} />
                  <input type="number" min="1" max="3" value={formData.uniqueValue} onChange={e => setFormData({...formData, uniqueValue: e.target.value})} required />
                </div>
                <div className="attribute-input">
                  <input type="text" value={formData.factorName} readOnly style={{backgroundColor: '#f0f0f0'}} />
                  <input type="number" min="1" max="3" value={formData.factorValue} onChange={e => setFormData({...formData, factorValue: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>所持スキル</label>
              <div className="skill-add">
                <input 
                  type="text" 
                  placeholder="スキル名を入力" 
                  value={skillInput} 
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkillToCharacter())}
                />
                <button type="button" className="btn btn-secondary" onClick={addSkillToCharacter}>追加</button>
              </div>
              <div className="skills-container" id="skillsList">
                {selectedSkills.length === 0 ? (
                  <div className="empty-state"><p>スキルが選択されていません</p></div>
                ) : (
                  selectedSkills.map(s => (
                    <div key={s.id} className="skill-item">
                      <label>{s.name}</label>
                      <button type="button" className="btn btn-danger" onClick={() => removeSelectedSkill(s.id)}>削除</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '15px'}}>キャラクターを保存</button>
          </form>
        </div>
        
        <div className="card">
          <h2>スキル管理データベース</h2>
          <div className="form-group">
            <label>新しいスキルを追加</label>
            <div className="skill-add">
              <input type="text" placeholder="新しいスキル名" value={newSkillInput} onChange={e => setNewSkillInput(e.target.value)} />
              <button className="btn btn-primary" onClick={addNewSkill}>登録</button>
            </div>
          </div>
          <div className="skills-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
            {allSkills.length === 0 ? (
              <div className="empty-state"><p>スキルがありません</p></div>
            ) : (
              allSkills.map(s => <div key={s.id} className="skill-item">・{s.name}</div>)
            )}
          </div>
        </div>

        <div className="card characters-section">
          <h2>登録済みキャラクター一覧</h2>
          <div className="characters-grid">
            {characters.map(c => (
              <div key={c.id} className="character-card">
                <h3 style={{borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px'}}>{c.name}</h3>
                <div style={{margin: '15px 0'}}>
                  {c.attributes && c.attributes.map(a => <div key={a.id}><strong>{a.name}:</strong> {a.value}</div>)}
                </div>
                <div className="skills-list" style={{background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px'}}>
                  {c.skills && c.skills.length > 0 
                    ? c.skills.map(s => <p key={s.id} style={{margin: '4px 0', fontSize: '0.9em'}}>• {s.name}</p>) 
                    : <p><em>スキルなし</em></p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
