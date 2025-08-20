// src/initialData.js

export const initialYearData = Array.from({ length: 12 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, '0');
  const monthStr = `2025/${month}`;
  
  if (month === '05') return { month: monthStr, nkrSalary: 105000, otySalary: 48000, nkrShifts: 11, otyShifts: 4, nkrHours: 88, otyHours: 24 };
  if (month === '06') return { month: monthStr, nkrSalary: 95000, otySalary: 52000, nkrShifts: 9, otyShifts: 6, nkrHours: 72, otyHours: 36 };
  if (month === '07') return { month: monthStr, nkrSalary: 100000, otySalary: 50000, nkrShifts: 10, otyShifts: 5, nkrHours: 80, otyHours: 30 };
  
  return { month: monthStr, nkrSalary: 0, otySalary: 0, nkrShifts: 0, otyShifts: 0, nkrHours: 0, otyHours: 0 };
});