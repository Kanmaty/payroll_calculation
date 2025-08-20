// src/MonthlyDataView.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styles } from './styles';

function MonthlyDataView({ yearData }) {
  const [viewMode, setViewMode] = useState('table');

  const graphData = yearData
    .filter(d => d.nkrSalary > 0 || d.otySalary > 0)
    .map(d => ({
      month: d.id, // グラフのX軸にはid (月) を使う
      NKR給与: d.nkrSalary,
      OTY給与: d.otySalary,
    }));

  // ★ 1. 各列の合計値を計算する
  const totals = yearData.reduce((acc, row) => {
    acc.nkrSalary += row.nkrSalary;
    acc.otySalary += row.otySalary;
    acc.nkrTaxableSalary += row.nkrTaxableSalary;
    acc.otyTaxableSalary += row.otyTaxableSalary;
    acc.nkrTime += row.nkrTime;
    acc.otyTime += row.otyTime;
    return acc;
  }, {
    nkrSalary: 0,
    otySalary: 0,
    nkrTaxableSalary: 0,
    otyTaxableSalary: 0,
    nkrTime: 0,
    otyTime: 0,
  });

  return (
    <div style={styles.card}>
      <h2>月別データ</h2>
      <button style={styles.toggleButton} onClick={() => setViewMode(viewMode === 'table' ? 'graph' : 'table')}>
        {viewMode === 'table' ? 'グラフで表示' : '表で表示'}
      </button>

      {viewMode === 'table' ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.thSticky }}>月</th>
                <th style={styles.th}>NKR給与</th>
                <th style={styles.th}>OTY給与</th>
                <th style={styles.th}>合計給与</th>
                <th style={styles.th}>NKR課税対象</th>
                <th style={styles.th}>OTY課税対象</th>
                <th style={styles.th}>NKR時間</th>
                <th style={styles.th}>OTY時間</th>
              </tr>
            </thead>
            <tbody>
              {yearData.map((row) => (
                <tr key={row.id}>
                  <td style={{ ...styles.td, ...styles.tdSticky }}>{row.id}</td>
                  <td style={styles.td}>{row.nkrSalary.toLocaleString()}円</td>
                  <td style={styles.td}>{row.otySalary.toLocaleString()}円</td>
                  <td style={styles.td}><strong>{(row.nkrSalary + row.otySalary).toLocaleString()}円</strong></td>
                  <td style={styles.td}>{row.nkrTaxableSalary.toLocaleString()}円</td>
                  <td style={styles.td}>{row.otyTaxableSalary.toLocaleString()}円</td>
                  <td style={styles.td}>{row.nkrTime.toFixed(2)}h</td>
                  <td style={styles.td}>{row.otyTime.toFixed(2)}h</td>
                </tr>
              ))}
            </tbody>
            {/* ★ 2. 合計行を tfoot として追加 */}
            <tfoot style={{ borderTop: '2px solid #e2e8f0', fontWeight: 'bold' }}>
              <tr>
                <td style={{ ...styles.td, ...styles.tdSticky }}>合計</td>
                <td style={styles.td}>{totals.nkrSalary.toLocaleString()}円</td>
                <td style={styles.td}>{totals.otySalary.toLocaleString()}円</td>
                <td style={styles.td}>{(totals.nkrSalary + totals.otySalary).toLocaleString()}円</td>
                <td style={styles.td}>{totals.nkrTaxableSalary.toLocaleString()}円</td>
                <td style={styles.td}>{totals.otyTaxableSalary.toLocaleString()}円</td>
                <td style={styles.td}>{totals.nkrTime.toFixed(2)}h</td>
                <td style={styles.td}>{totals.otyTime.toFixed(2)}h</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        // グラフ部分は変更なし
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={graphData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip formatter={(value) => `${value.toLocaleString()}円`} />
              <Legend />
              <Bar dataKey="NKR給与" fill="#8884d8" />
              <Bar dataKey="OTY給与" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MonthlyDataView;