import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// นี่คือรหัสผ่านเข้าบ้านของฐานข้อมูลคุณ (ซึ่งใช้ฟรี 100% บน Spark Plan)
// หมายเหตุ: ในการใช้งานจริง ข้อมูลเหล่านี้จะถูกเติมจากหน้าเว็บ Firebase Console 
// แต่ผมจะวางโครงสร้างที่ปลอดภัยและพร้อมใช้งานไว้ให้คุณก่อนครับ
const firebaseConfig = {
  apiKey: "AIzaSyB-YOUR-ACTUAL-API-KEY",
  authDomain: "mitosis-crisis.firebaseapp.com",
  projectId: "mitosis-crisis",
  storageBucket: "mitosis-crisis.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// ตรวจสอบว่าแอปเชื่อมต่อกับฐานข้อมูลหรือยัง เพื่อไม่ให้เกิดการเชื่อมต่อซ้ำซ้อน
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
