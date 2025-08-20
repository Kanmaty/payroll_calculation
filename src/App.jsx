// src/App.jsx
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, query, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

import SalaryForm from "./SalaryForm";
import SummaryCard from "./SummaryCard";
import MonthlyDataView from "./MonthlyDataView";
import { styles } from "./styles";
import { NKR_HOURLY_WAGE, OTY_HOURLY_WAGE, NKR_COMMUTING_COST, OTY_COMMUTING_COST } from "./constants";

function App() {
  const [nkrData, setNkrData] = useState([]); // NKR用のState
  const [otyData, setOtyData] = useState([]); // OTY用のState
  const [yearData, setYearData] = useState([]); // 2つを結合した最終的なデータ
  const [selectedMonth, setSelectedMonth] = useState(String(1));
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // --- NKRコレクションを監視 ---
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "NKR")), (snapshot) => {
      if (snapshot.empty) createInitialDataForCompany("NKR");
      setNkrData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  // --- OTYコレクションを監視 ---
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "OTY")), (snapshot) => {
      if (snapshot.empty) createInitialDataForCompany("OTY");
      setOtyData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  // --- NKRかOTYのデータが更新されたら、2つを結合してyearDataを作成 ---
  useEffect(() => {
    if (nkrData.length === 0 || otyData.length === 0) return;

    const mergedData = Array.from({ length: 12 }, (_, i) => {
      const monthId = String(i + 1);
      const nkrMonthData = nkrData.find((d) => d.id === monthId) || {};
      const otyMonthData = otyData.find((d) => d.id === monthId) || {};

      return {
        id: monthId,
        nkrSalary: nkrMonthData.salary || 0,
        nkrTime: nkrMonthData.time || 0,
        nkrTaxableSalary: nkrMonthData.taxable_salary || 0,
        otySalary: otyMonthData.salary || 0,
        otyTime: otyMonthData.time || 0,
        otyTaxableSalary: otyMonthData.taxable_salary || 0,
      };
    });

    setYearData(mergedData);
    setIsLoading(false);
  }, [nkrData, otyData]);

  useEffect(() => {
    if (yearData.length > 0) {
      const dataForSelectedMonth = yearData.find((d) => d.id === selectedMonth);
      if (dataForSelectedMonth) setFormData(dataForSelectedMonth);
    }
  }, [selectedMonth, yearData]);

  const handleSave = async () => {
    if (!formData.id) {
      return alert("保存する月が選択されていません。");
    }

    // 送信するデータを保持するオブジェクトを作成
    let nkrDataToSave = {};
    let otyDataToSave = {};

    // 更新後のformDataを保持するオブジェクト
    let updatedFormData = { ...formData };

    // --- NKRの計算 ---
    if (formData.nkrSalary > 0) {
      const nkrSalary = Number(formData.nkrSalary) || 0;
      const nkrOnSiteNum = Number(formData.nkrOnSiteNum) || 0;
      const nkrTaxableSalary = nkrSalary - NKR_COMMUTING_COST * nkrOnSiteNum;
      const nkrTime = Math.round((nkrTaxableSalary / NKR_HOURLY_WAGE) * 100) / 100;

      // 計算結果をローカル変数に格納
      nkrDataToSave = {
        salary: nkrSalary,
        taxable_salary: nkrTaxableSalary,
        time: nkrTime,
      };
      // 更新後のformDataにも反映
      updatedFormData.nkrTime = nkrTime;
      updatedFormData.nkrTaxableSalary = nkrTaxableSalary;
    } else if (formData.nkrTime > 0) {
      const nkrTime = Number(formData.nkrTime) || 0;
      const nkrOnSiteNum = Number(formData.nkrOnSiteNum) || 0;
      const hours = Math.trunc(nkrTime);
      const minutes = Number(String(nkrTime).split(".")[1] || 0);
      const decimalHours = hours + minutes / 60;
      const nkrTaxableSalary = decimalHours * NKR_HOURLY_WAGE;
      const nkrSalary = nkrTaxableSalary + NKR_COMMUTING_COST * nkrOnSiteNum;

      // 計算結果をローカル変数に格納
      nkrDataToSave = {
        salary: nkrSalary,
        taxable_salary: nkrTaxableSalary,
        time: nkrTime,
      };
      // 更新後のformDataにも反映
      updatedFormData.nkrSalary = nkrSalary;
      updatedFormData.nkrTaxableSalary = nkrTaxableSalary;
    }

    // --- OTYの計算（NKRと同様に修正） ---
    if (formData.otySalary > 0) {
      const otySalary = Number(formData.otySalary) || 0;
      const otyOnSiteNum = Number(formData.otyOnSiteNum) || 0;
      const otyTaxableSalary = otySalary - OTY_COMMUTING_COST * otyOnSiteNum;
      const otyTime = Math.round((otyTaxableSalary / OTY_HOURLY_WAGE) * 100) / 100;

      otyDataToSave = {
        salary: otySalary,
        taxable_salary: otyTaxableSalary,
        time: otyTime,
      };
      updatedFormData.otyTime = otyTime;
      updatedFormData.otyTaxableSalary = otyTaxableSalary;
    }

    // 画面の表示を更新
    setFormData(updatedFormData);

    // --- バッチ処理 ---
    const batch = writeBatch(db);

    if (Object.keys(nkrDataToSave).length > 0) {
      const nkrDocRef = doc(db, "NKR", String(formData.id));
      // { merge: true } を使い、意図しないフィールドの上書きを防ぐ
      batch.set(nkrDocRef, nkrDataToSave, { merge: true });
    }

    if (Object.keys(otyDataToSave).length > 0) {
      const otyDocRef = doc(db, "OTY", String(formData.id));
      batch.set(otyDocRef, otyDataToSave, { merge: true });
    }

    await batch.commit();
    alert(`${formData.id}月のデータを保存しました！`);
  };

  const createInitialDataForCompany = async (companyName) => {
    const batch = writeBatch(db);
    for (let i = 1; i <= 12; i++) {
      const docRef = doc(db, companyName, i.toString());
      batch.set(docRef, { salary: 0, time: 0, taxable_salary: 0 });
    }
    await batch.commit();
  };

  const totals = yearData.reduce(
    (acc, cur) => {
      acc.totalSalary += cur.nkrSalary + cur.otySalary;
      acc.totalHours += cur.nkrTime + cur.otyTime;
      return acc;
    },
    { totalSalary: 0, totalHours: 0 }
  );

  if (isLoading) return <div>データを読み込み中...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>給与管理ツール (2025年)</h1>
      <SalaryForm
        yearData={yearData}
        selectedMonth={selectedMonth}
        formData={formData}
        onMonthChange={setSelectedMonth}
        onFormChange={setFormData}
        onSave={handleSave}
      />
      <SummaryCard totals={totals} />
      <MonthlyDataView yearData={yearData} />
    </div>
  );
}

export default App;
