// src/SummaryCard.jsx
import React from 'react';
import { styles } from './styles';

function SummaryCard({ totals }) {
  return (
    <div style={styles.card}>
      <h2>累計データ</h2>
      <p><strong>総支給額:</strong> {totals.totalSalary.toLocaleString()} 円</p>
      <p><strong>総勤務時間:</strong> {totals.totalHours} 時間</p>
    </div>
  );
}

export default SummaryCard;