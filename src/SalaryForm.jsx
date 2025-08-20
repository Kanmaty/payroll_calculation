// src/SalaryForm.jsx
import React from 'react';
import { styles } from './styles';

function SalaryForm({ yearData, selectedMonth, formData, onMonthChange, onFormChange, onSave }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(prev => ({ ...prev, [name]: Number(value) }));
  };

  return (
    <div style={styles.card}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>対象月</label>
        <select style={styles.select} value={selectedMonth} onChange={(e) => onMonthChange(e.target.value)}>
          {yearData.map(d => <option key={d.id} value={String(d.id)}>{d.id}</option>)}
        </select>
      </div>
      <div style={styles.formGrid}>
        <div>
          <h3>NKR</h3>
          <div style={styles.inputGroup}><label style={styles.label}>給与</label><input style={styles.input} type="number" name="nkrSalary" value={formData.nkrSalary || ''} onChange={handleInputChange} /></div>
          <div style={styles.inputGroup}><label style={styles.label}>出社回数</label><input style={styles.input} type="number" name="nkrOnSiteNum" value={formData.nkrOnSiteNum || ''} onChange={handleInputChange} /></div>
          <div style={styles.inputGroup}><label style={styles.label}>勤務時間（h）</label><input style={styles.input} type="number" name="nkrTime" value={formData.nkrTime || ''} onChange={handleInputChange} /></div>
        </div>
        <div>
          <h3>OTY</h3>
          <div style={styles.inputGroup}><label style={styles.label}>給与</label><input style={styles.input} type="number" name="otySalary" value={formData.otySalary || ''} onChange={handleInputChange} /></div>
          <div style={styles.inputGroup}><label style={styles.label}>出社回数 </label><input style={styles.input} type="number" name="otyOnSiteNum" value={formData.otyOnSiteNum || ''} onChange={handleInputChange} /></div>
          <div style={styles.inputGroup}><label style={styles.label}>勤務時間（h）</label><input style={styles.input} type="number" name="otyTime" value={formData.otyTime || ''} onChange={handleInputChange} /></div>
        </div>
      </div>
      <button style={styles.button} onClick={onSave}>この月のデータを保存</button>
    </div>
  );
}

export default SalaryForm;