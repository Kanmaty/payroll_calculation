// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyB4YlMV-D1D7HaKmXBELMS8HPF_xje2fP4",
  authDomain: "kk-payroll-calculation.firebaseapp.com",
  projectId: "kk-payroll-calculation",
  storageBucket: "kk-payroll-calculation.firebasestorage.app",
  messagingSenderId: "446194298686",
  appId: "1:446194298686:web:38e921ec841709920f466f",
  measurementId: "G-7WWKQHZ44Y"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// Firestoreのインスタンスを取得してエクスポート
export const db = getFirestore(app);